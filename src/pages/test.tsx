import { useEffect, useRef } from "react";
function Test() {
  const parent = useRef<any>();
  const child = useRef<any>();
  useEffect(() => {
    document.addEventListener("scroll", () => {
      const vitriManhinh = parent.current.getClientRects()[0].top;
      if (vitriManhinh < -500) return;
      child.current.style.transform = `translateY( -${Math.floor(
        window.scrollY / 2
      )}px )`;
    });
  }, []);
  return (
    <>
      <div className="bg-[#f68b8b] w-full h-[2000px]">
        <div className="h-[200px]"></div>
        <div
          className="overflow-hidden w-full h-[500px] relative "
          ref={parent}
        >
          <img
            className="w-full absolute"
            src="https://www.imgacademy.com/themes/custom/imgacademy/images/helpbox-contact.jpg"
            ref={child}
          />
        </div>
      </div>
    </>
  );
}

export default Test;
