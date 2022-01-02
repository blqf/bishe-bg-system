# host

http://localhost:5008

# 登录

path: /api/admin/login
method: post

请求参数
username: string;
password: string;

响应数据
success: {code: number; data:object};
error: 'login fail'

# 修改密码

path: /api/admin
method: put

请求参数
username: string;
oldPassword: string;
newPassword: string;

响应数据
{code: number; data :boolean}

# whoami

path: /api/admin/whoami
method: post

请求参数
authorization: string

响应数据
success: {code: number; data: object}
failed: string;
