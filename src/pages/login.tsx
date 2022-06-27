import type { NextPage } from "next";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { Form, Input, Button } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";

import { useAppDispatch, useAppSelector } from "../app/hooks";
import { Login } from "../feature/auth/AuthSlice";
import { LoginParam } from "../interface/auth";
import s from "../styles/login.module.scss";
const Loign: NextPage = () => {
  const dispatch = useAppDispatch();
  const authState = useAppSelector((state) => state.authSlice);
  const router = useRouter();
  const loginHandle = (value: LoginParam) => {
    dispatch(Login(value));
  };
  useEffect(() => {
    if (authState.isSuccess) {
      router.push("/");
    }
  }, [authState.isSuccess]);
  return (
    <div className={`bg-[#2b2b2b] ${s.bg}`}>
      <div className={s.wrapper}>
        <h1 className="text-5xl text-white ">PTITWORKS ADMIN</h1>
        <h1 className="text-2xl text-white">Login to Ptitworks admin</h1>
        <div className={s.form}>
          <Form
            name="normal_login"
            layout="horizontal"
            initialValues={{ remember: true }}
            autoComplete="off"
            size={"large"}
            onFinish={loginHandle}
          >
            {authState.isError && (
              <Form.Item className="error">
                <p className="text-red-500">
                  Please check Username or Password
                </p>
                <p className="text-red-500">{authState.messageError}</p>
              </Form.Item>
            )}
            <Form.Item
              name="username"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder="Username" />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input
                prefix={<LockOutlined />}
                type="password"
                placeholder="Password"
              />
            </Form.Item>

            <Form.Item>
              <Button
                className="text-white "
                type="primary"
                htmlType="submit"
                loading={authState.isLoading}
              >
                Đăng nhập
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Loign;
