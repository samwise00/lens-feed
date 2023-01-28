"use client";

const ColorThemeBtn = ({ theme, onClick }) => {
  return (
    <button onClick={onClick}>
      <div className="h-[24px] w-[24px] pl-[1px] border-black dark:border-white border-[1px] rounded-[4px]">
        <img
          src="/dark2.png"
          className="h-[22px] pb-1 pl-[2px] pt-[2px] dark:invert-[100%]"
        />
      </div>
    </button>
  );
};

export default ColorThemeBtn;
