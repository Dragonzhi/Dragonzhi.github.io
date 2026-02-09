import requests
import json
from datetime import datetime
import os

def get_github_contributions(username, token, year=None):
    """
    从 GitHub GraphQL API 获取指定用户的年度贡献数据。

    Args:
        username (str): GitHub 用户名。
        token (str): 具有 'read:user' 权限的 GitHub 个人访问令牌。
        year (int, optional): 要获取贡献数据的年份。如果未指定，则默认为当前年份。

    Returns:
        dict: 包含贡献数据的字典，如果发生错误则返回 None。
    """
    if year is None:
        year = datetime.now().year

    url = "https://api.github.com/graphql"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }

    # GraphQL API 的 'from' 和 'to' 参数最多只能跨越一年。
    from_date = f"{year}-01-01T00:00:00Z"
    to_date = f"{year}-12-31T23:59:59Z"

    query = """
    query($username: String!, $from: DateTime!, $to: DateTime!) {
      user(login: $username) {
        contributionsCollection(from: $from, to: $to) {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                date
                contributionCount
              }
            }
          }
        }
      }
    }
    """

    payload = {
        "query": query,
        "variables": {
            "username": username,
            "from": from_date,
            "to": to_date
        }
    }

    try:
        response = requests.post(url, headers=headers, data=json.dumps(payload))
        response.raise_for_status()

        data = response.json()

        if 'errors' in data:
            print(f"GraphQL API 返回错误: {data['errors']}")
            return None

        contribution_data = data['data']['user']['contributionsCollection']['contributionCalendar']
        
        # Cal-Heatmap 期望的格式是 { timestamp_in_seconds: count, ... }
        cal_heatmap_data = {}
        for week in contribution_data['weeks']:
            for day in week['contributionDays']:
                # 将日期字符串转换为 datetime 对象
                dt_object = datetime.strptime(day['date'], "%Y-%m-%d")
                # 获取 Unix 时间戳 (秒)
                timestamp_in_seconds = int(dt_object.timestamp())
                cal_heatmap_data[timestamp_in_seconds] = day['contributionCount']
        
        return cal_heatmap_data

    except requests.exceptions.RequestException as e:
        print(f"请求 GitHub API 时发生错误: {e}")
        return None
    except json.JSONDecodeError:
        print("无法解析 API 响应为 JSON。")
        return None
    except KeyError as e:
        print(f"API 响应中缺少预期的键: {e}. 响应: {data}")
        return None

if __name__ == "__main__":
    github_username = input("请输入 GitHub 用户名: ")
    github_token = input("请输入您的 GitHub 个人访问令牌 (PAT): ")
    
    current_year = datetime.now().year
    
    contributions = get_github_contributions(github_username, github_token, current_year)

    if contributions:
        output_filename = os.path.join("data", f"{github_username}_contributions_{current_year}.json")
        
        os.makedirs("data", exist_ok=True)

        with open(output_filename, "w") as f:
            json.dump(contributions, f, indent=2)
        print(f"贡献数据已保存到 {output_filename}")
    else:
        print("未能获取贡献数据。")
