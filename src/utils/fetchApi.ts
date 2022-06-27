import axiosClient from "./axiosClient";
import { AxiosRequestConfig } from "axios";
import { UserProfile, CreateUser } from "../interface/user";
const getStoreLocal = (item: string) => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(item);
  }
};

export const login = async (data: object) => {
  let resData = await axiosClient.post("login", data);
  return resData;
};

export const getInfor = async (data: object, option: AxiosRequestConfig) => {
  let resData = await axiosClient.post("getinfo", data, option);
  return resData;
};

export const getUser = async (option: AxiosRequestConfig) => {
  let resData = await axiosClient.get("dataUser", option);
  return resData;
};

export const deleteUser = async (data: object) => {
  await axiosClient.post("deleteuser", data);
};

export const findUser = async (data: object) => {
  let resData = await axiosClient.post("frofileuser", data);
  return resData;
};

export const updateUser = async (data: UserProfile) => {
  await axiosClient.post("updateprofile", data);
};

export const createUser = async (data: CreateUser) => {
  await axiosClient.post("createuser", data);
};

export const createListUser = async (data: object) => {
  await axiosClient.post("createlistuser", data);
};
