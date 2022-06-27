import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { logOut } from "../../feature/auth/AuthSlice";

const Header = () => {
  const userState = useAppSelector((state) => state.userSlice);
  const dispatch = useAppDispatch();
  const router = useRouter();
  return (
    <div className="bg-white w-full h-[50px] shadow-sm shadow-[#6f6f6f69] ">
      <div className="float-right h-full flex items-center">
        <div>
          <h1 className="m-0 text-2xl	">{userState.name}</h1>
          <h2 className="m-0 float-right text-[#2150ec]">
            {userState.userName}
          </h2>
        </div>
        <div className="bg-[#5c0789] rounded-full w-[40px] h-[40px] mx-3 flex flex-col justify-center items-center overflow-hidden">
          {userState.name && (
            <span className="text-white text-3xl	overflow-hidden">
              {
                userState.name.split("").reverse().join("")[
                  userState.name.split("").reverse().join("").indexOf(" ") - 1
                ]
              }
            </span>
          )}
        </div>
        <button
          className="border-dashed rounded-lg border-2 border-[#ff4d4f] p-2 text-[#ff4d4f] hover:bg-[#ff4d4f] hover:text-white"
          onClick={() => {
            dispatch(logOut());
            router.push("/login");
          }}
        >
          Đăng xuất
        </button>
      </div>
    </div>
  );
};

export default Header;
