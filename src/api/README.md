# 登录

path: /admin/login
method: post

请求参数
username: string;
password: string;

响应数据
success: {id:number; username: string; passwrod};
error: 'login fail'

# 修改密码

path: /admin
method: put

请求参数
username: string;
oldPassword: string;
newPassword: string;

响应数据
{rows: number}