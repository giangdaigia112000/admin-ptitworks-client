import type { NextPage } from "next";
import React, { useEffect, useRef, useState } from "react";
import {
  Input,
  Button,
  Tooltip,
  Modal,
  notification,
  Timeline,
  Popconfirm,
  Table,
  Checkbox,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  UploadOutlined,
  DeleteFilled,
  EditFilled,
  ExclamationCircleOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  PoweroffOutlined,
} from "@ant-design/icons";
import moment from "moment";
import "moment/locale/vi";
import * as XLSX from "xlsx";
import { UserProfile, CreateUser } from "../interface/user";
import Header from "../components/Header";
import { setInfo } from "../feature/user/userSlice";
import * as fetchApi from "../utils/fetchApi";
import {
  dbstorage,
  refstorage,
  uploadBytes,
  getDownloadURL,
} from "../utils/firebase";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import useDebounce from "../app/useDebounce";

const Home: NextPage = () => {
  const { confirm } = Modal;
  const columns = [
    {
      title: "STT",
      dataIndex: "__rowNum__",
      key: "__rowNum__",
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Password",
      dataIndex: "password",
      key: "password",
    },
    {
      title: "Họ tên",
      dataIndex: "fullname",
      key: "fullname",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
  ];
  const color = [
    "red",
    "blue",
    "green",
    "gray",
    "orange",
    "violet",
    "yellow",
    "pink",
    "brown",
  ];
  const authState = useAppSelector((state) => state.authSlice);
  const dispatch = useAppDispatch();
  const [process, setProcess] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState<string>("");
  const [visible, setVisible] = useState(false);
  const [modalImport, setModalImport] = useState(false);
  const [modalImportOne, setModalImportOne] = useState(false);
  const [loadingImport, setLoadingImport] = useState(false);
  const [loadingImportOne, setLoadingImportOne] = useState(false);
  const [profileUser, setProfileUser] = useState<UserProfile>();
  const [createUser, setCreateUser] = useState<CreateUser>({
    id: "",
    password: "",
    name: "",
    email: "",
  });
  const [createListUser, setCreateListUser] = useState<CreateUser[]>([]);
  const [historyUser, setHistoryUser] = useState<any>();
  const [listUser, setListUser] = useState([]);
  const [changeProfile, setChangeProfile] = useState(false);
  const [importAcc, setImportAcc] = useState<any[]>();
  const inputFile = useRef<any>();
  const imageProfile = useRef<any>();
  const inputExcel = useRef<any>();
  const debounced = useDebounce(search, 500);

  const checkShow = (title: string) => {
    if (debounced == "") {
      return true;
    }
    return title.toLowerCase().includes(debounced);
  };
  const showDeleteUserConfirm = (id: string) => {
    confirm({
      title: "Bạn đồng ý xóa tài khoản này ?",
      icon: <ExclamationCircleOutlined />,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk() {
        (async () => {
          try {
            await fetchApi.deleteUser({ id: id });
            CallSuccess("Xóa tài khoản thành công");
            setListUser(listUser.filter((user: any) => user.id != id));
          } catch (error) {
            CallErrors("Thất bại !!");
          }
        })();
      },
      onCancel() {},
    });
  };
  const showProfileUser = async (id: string) => {
    try {
      const data = await fetchApi.findUser({ id: id });
      setProfileUser(data.data.user);
      setHistoryUser(data.data.historyUser);
      setVisible(true);
    } catch (error) {
      CallErrors("Lỗi server !!");
    }
  };
  const handleUpdateProfile = async () => {
    try {
      await fetchApi.updateUser({
        id: profileUser?.id,
        name: profileUser?.name,
        avt: profileUser?.avt,
        email: profileUser?.email,
        password: profileUser?.password,
        active: profileUser?.active,
      });
      CallSuccess("Thay đổi thông tin thành công !!!");
    } catch (error) {
      CallErrors("Lỗi server !!");
    }
  };
  const handleCreateUser = async () => {
    setLoadingImportOne(true);
    try {
      if (
        createUser.id &&
        createUser.password &&
        createUser.name &&
        createUser.email
      ) {
        await fetchApi.createUser({ ...createUser });
        setLoadingImportOne(false);
        CallSuccess("Thêm tài khoản thành công");
      } else {
        CallErrors("Vui lòng nhập đủ thông tin");
        setLoadingImportOne(false);
        return;
      }
    } catch (error: any) {
      setLoadingImportOne(false);
      const statusCode = error.response.status;
      if (statusCode == 400) {
        CallErrors("Tài khoản đã tồn tại");
      } else {
        CallErrors("Lỗi server");
      }
    }
  };
  const handleCreateListUser = async () => {
    setLoadingImport(true);
    try {
      await fetchApi.createListUser({ listUser: createListUser });
      setLoadingImport(false);
      CallSuccess("Thêm tài khoản thành công");
    } catch (error: any) {
      setLoadingImport(false);
      const statusCode = error.response.status;
      if (statusCode == 401) {
        console.log(error.response.data);
        let userExist = "";
        error.response.data.map((item: any) => {
          userExist = userExist + `${item.id}, `;
        });
        notification.error({
          message: `Các tài khoản: ${userExist} đã tồn tại!!`,
          placement: "top",
          duration: 10,
        });
      } else {
        CallErrors("Lỗi server");
      }
    }
  };
  const CallErrors = (message: string) => {
    notification.error({
      message: message,
      placement: "top",
      duration: 1,
    });
  };
  const CallSuccess = (message: string) => {
    notification.success({
      message: message,
      placement: "top",
      duration: 1,
    });
  };
  const readExcel = (file: File) => {
    const promiseReadFile = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);
      fileReader.onload = (e: any) => {
        const bufferArray = e.target.result;
        const wb = XLSX.read(bufferArray, { type: "buffer" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        console.log(data);
        resolve(data);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });

    promiseReadFile
      .then((data: any) => {
        setImportAcc(data);
        const listImport = data.map((item: any) => {
          return {
            id: item.username,
            name: item.fullname,
            email: item.email,
            password: item.password,
          };
        });

        setCreateListUser(listImport);
        setModalImport(true);
      })
      .catch((error) => {
        CallErrors("Lỗi đọc file.");
      });
  };
  useEffect(() => {
    (async () => {
      try {
        const resData = await fetchApi.getInfor(
          {
            id: authState.accessToken,
          },
          {}
        );
        dispatch(
          setInfo({
            name: resData.data.name,
            username: resData.data.username,
          })
        );
      } catch (error) {
        CallErrors("Lỗi server !!");
      }
    })();
  }, []);
  const getUser = async () => {
    setProcess(10);
    setLoading(true);
    try {
      const resData = await fetchApi.getUser({
        onDownloadProgress: (progressEvent) => {
          let percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log(progressEvent.loaded, progressEvent.total);

          setProcess(percentCompleted);
        },
      });
      setListUser(resData.data);
      setTimeout(() => {
        setLoading(false);
      }, 500);
    } catch (error) {
      setProcess(0);
      setLoading(false);
      CallErrors("Lỗi server !!");
    }
  };
  useEffect(() => {
    (async () => {
      await getUser();
    })();
  }, []);

  return (
    <div className="w-[1000px] m-auto ">
      <Header />
      <div className="w-full my-3 flex flex-row-reverse">
        <div className="mr-5">
          <Button type="link">
            <a href="/filemau.xlsx" download="filemau">
              Tải xuống file mẫu.
            </a>
          </Button>
          <Tooltip title="Nhập file">
            <Popconfirm
              placement="left"
              title="Nhập file cho nhiều tài khoản !!!"
              onConfirm={() => {
                inputExcel.current.click();
              }}
              okText="Tải lên"
              cancelText="Hủy"
            >
              <Button
                shape="circle"
                icon={<UploadOutlined />}
                size="large"
                className="mr-5"
              />
            </Popconfirm>
            <input
              hidden
              type="file"
              ref={inputExcel}
              onChange={async (e: any) => {
                console.log("loadFile");
                const file = e.target.files[0];
                if (
                  file &&
                  file.type ==
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                ) {
                  await readExcel(file);
                } else {
                  CallErrors("File không đúng định dạng !!!");
                }
              }}
            />
          </Tooltip>
          <Tooltip title="Thêm tài khoản">
            <Button
              type="primary"
              shape="default"
              icon={<PlusOutlined />}
              size="large"
              onClick={() => {
                setCreateUser({
                  id: "",
                  password: "",
                  name: "",
                  email: "",
                });
                setModalImportOne(true);
              }}
            />
          </Tooltip>
        </div>
      </div>
      <div className="w-full bg-white relative">
        <div className="flex items-center w-full justify-center py-3">
          <h2 className="text-2xl font-bold	mr-2">Tìm kiếm</h2>
          <Input
            size="large"
            prefix={<SearchOutlined />}
            style={{ width: "500px" }}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
        </div>
        {loading && (
          <div
            className={`h-[5px] bg-blue-700 absolute top-0 left-0`}
            style={{
              width: `${process}%`,
              transition: "width 0.5s ",
            }}
          ></div>
        )}
        <Button
          type="link"
          onClick={() => {
            getUser();
          }}
        >
          Tải lại
        </Button>
        <div className="mt-2 p-4">
          {listUser &&
            listUser.length > 0 &&
            listUser.map((user: any, index) => {
              return (
                <>
                  {checkShow(user.name) && (
                    <div
                      key={index}
                      className="w-full p-4  border-t-[1px] border-[#c6c6c6] flex justify-between"
                    >
                      <div className="flex">
                        <img
                          className="w-[100px] h-[100px] mr-2 object-cover rounded-full border-8 border-indigo-600 "
                          src={user.avt}
                          alt=""
                        />
                        <div className="my-auto">
                          <h2 className="font-bold text-2xl text-[#2475e7]		">
                            {user.name}
                          </h2>
                          <h3>{user.id}</h3>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Button
                          className="mr-2"
                          type="primary"
                          icon={<DeleteFilled />}
                          danger
                          onClick={() => {
                            showDeleteUserConfirm(user.id);
                          }}
                        >
                          Xóa tài khoản
                        </Button>
                        <Button
                          type="primary"
                          icon={<EditFilled />}
                          onClick={() => {
                            showProfileUser(user.id);
                          }}
                        >
                          Sửa tài khoản
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              );
            })}
        </div>
      </div>
      {/* modal import */}
      <Modal
        visible={modalImportOne}
        title="Tạo tài khoản mới"
        onCancel={() => {
          setModalImportOne(false);
        }}
        footer={[
          <Button
            key="back"
            onClick={() => {
              setModalImportOne(false);
            }}
          >
            Hủy
          </Button>,
          <Button
            key="back"
            type="primary"
            loading={loadingImportOne}
            onClick={() => {
              handleCreateUser();
            }}
          >
            Tạo tài khoản
          </Button>,
        ]}
      >
        <span className="my-[2px] inline-block">Tài khoản</span>
        <Input
          placeholder=""
          size={"large"}
          value={createUser?.id}
          onChange={(e) => {
            setCreateUser({
              ...createUser,
              id: e.target.value,
            });
          }}
        />
        <span className="my-[2px] inline-block">Mật khẩu</span>
        <Input.Password
          size={"large"}
          iconRender={(visible) =>
            visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
          }
          value={createUser?.password}
          onChange={(e) => {
            setCreateUser({
              ...createUser,
              password: e.target.value,
            });
          }}
        />
        <span className="my-[2px] inline-block">Họ và tên</span>
        <Input
          placeholder=""
          size={"large"}
          value={createUser?.name}
          onChange={(e) => {
            setCreateUser({
              ...createUser,
              name: e.target.value,
            });
          }}
        />
        <span className="my-[2px] inline-block">Email</span>
        <Input
          placeholder=""
          size={"large"}
          value={createUser?.email}
          onChange={(e) => {
            setCreateUser({
              ...createUser,
              email: e.target.value,
            });
          }}
        />
      </Modal>
      {/* modal list import */}
      <Modal
        title="Danh sách tài khoản !!!"
        centered
        visible={modalImport}
        footer={[
          <Button
            key="back"
            onClick={() => {
              setModalImport(false);
            }}
          >
            Hủy
          </Button>,
          <Button
            key="to"
            type="primary"
            loading={loadingImport}
            onClick={() => {
              handleCreateListUser();
            }}
          >
            Tạo hàng loạt
          </Button>,
        ]}
        onCancel={() => {
          setModalImport(false);
        }}
        width={1000}
      >
        <div className="w-full">
          <Table
            dataSource={importAcc}
            columns={columns}
            pagination={{ pageSize: 5 }}
          />
        </div>
      </Modal>
      {/* modal profile */}
      <Modal
        title="Chi tiết tài khoản"
        centered
        visible={visible}
        onCancel={() => {
          setVisible(false);
          setChangeProfile(false);
        }}
        width={1000}
        footer={[
          <Button
            key="back"
            onClick={() => {
              setVisible(false);
              setChangeProfile(false);
            }}
          >
            Hủy
          </Button>,
        ]}
      >
        <div className="max-h-[500px] overflow-y-auto w-full">
          {profileUser && (
            <div className="w-full flex mb-10">
              <div className="w-[300px]">
                <h2>Thông tin tài khoản</h2>
                <span className="text-[#7a7a7a]  text-xl">
                  Một số thông tin cơ bản của tài khoản.
                </span>
              </div>
              <div className="shadow-md shadow-[#7b7b7b75] w-[600px] mx-auto p-10 flex">
                <div className="w-[50%]">
                  <Tooltip title="Sửa hình đại diện" color={"cyan"}>
                    <img
                      ref={imageProfile}
                      className="w-[200px] h-[200px] object-cover cursor-pointer"
                      src={profileUser?.avt}
                      onClick={() => {
                        inputFile.current.click();
                      }}
                    />
                  </Tooltip>
                  <input
                    ref={inputFile}
                    type="file"
                    hidden
                    onChange={async (e) => {
                      if (e.target.files && e.target.files.length) {
                        let file = e.target.files[0];
                        imageProfile.current.src = URL.createObjectURL(file);
                        let storageRef = refstorage(
                          dbstorage,
                          "avt/" + file.name
                        );
                        await uploadBytes(storageRef, file).then((snapshot) => {
                          console.log("Uploaded a blob or file!" + snapshot);
                        });
                        await getDownloadURL(storageRef).then((url) => {
                          setProfileUser({
                            ...profileUser,
                            avt: url,
                          });
                        });
                        setChangeProfile(true);
                      }
                    }}
                  />
                  <span className="my-[2px] inline-block">Mật khẩu</span>
                  <Input.Password
                    size={"large"}
                    iconRender={(visible) =>
                      visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                    }
                    value={profileUser?.password}
                    onChange={(e) => {
                      setProfileUser({
                        ...profileUser,
                        password: e.target.value,
                      });
                      setChangeProfile(true);
                    }}
                  />
                </div>
                <div className="w-[50%]">
                  <span className="my-[2px] inline-block">Tài khoản</span>
                  <Input
                    placeholder=""
                    size={"large"}
                    disabled
                    value={profileUser?.id}
                  />
                  <span className="my-[2px] inline-block">Họ và tên</span>
                  <Input
                    placeholder=""
                    size={"large"}
                    value={profileUser?.name}
                    onChange={(e) => {
                      setProfileUser({
                        ...profileUser,
                        name: e.target.value,
                      });
                      setChangeProfile(true);
                    }}
                  />
                  <span className="my-[2px] inline-block">Email</span>
                  <Input
                    placeholder=""
                    size={"large"}
                    value={profileUser?.email}
                    onChange={(e) => {
                      setProfileUser({
                        ...profileUser,
                        email: e.target.value,
                      });
                      setChangeProfile(true);
                    }}
                  />
                  <div className="mt-[28px] p-[9px] text-center">
                    <Checkbox
                      checked={profileUser.active}
                      onChange={(e) => {
                        setProfileUser({
                          ...profileUser,
                          active: e.target.checked,
                        });
                        setChangeProfile(true);
                      }}
                    >
                      Hoạt động
                    </Checkbox>
                  </div>

                  <Button
                    className="mt-[30px]  float-right"
                    type="primary"
                    disabled={!changeProfile}
                    onClick={handleUpdateProfile}
                  >
                    Lưu thay đổi
                  </Button>
                </div>
              </div>
            </div>
          )}

          <hr />

          <div className="w-full">
            <div className="w-[300px] mb-5">
              <div>
                <h2>Lịch sử</h2>
                <span className="text-[#7a7a7a] text-xl">
                  Một số thông tin về lịch sử hoạt động của user.
                </span>
              </div>
            </div>
            <div className="w-[600px] mx-auto pt-2">
              <Timeline mode="alternate">
                {historyUser &&
                  historyUser.history.map((item: any, index: any) => {
                    return (
                      <Timeline.Item
                        key={index}
                        color={color[Math.floor(Math.random() * 8)]}
                      >
                        {item.action} lúc :{" "}
                        {moment(item.time).locale("vi").format("LLLL")}
                      </Timeline.Item>
                    );
                  })}
              </Timeline>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Home;
