import { useEffect, useState } from "react";
import { DateRangePicker } from "react-date-range";
import { useForm, useWatch } from "react-hook-form";
import { addDays } from "date-fns";
import dayjs from "dayjs";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css";
import "../calendar.css";
import backHome from "../images/back home.png";
import RoomCarousel from "../components/RoomCarousel";
import RoomDetail from "../container/RoomDetail";
import Dialog from "../container/Dialog";
import { Loading } from "../components/Loading";
import { NavLink, useParams } from "react-router-dom";
import axios from "axios";
const url = "https://challenge.thef2e.com/api/thef2e2019/stage6/room";
const token =
  "Bearer IAlFGuHujADexllpJHWL1MenPYbizgbL00yxoV8wLs9zfZxS4hgs0wVo6E6b";
const authorization = { headers: { Authorization: token } };
import { ModalProvider } from "react-modal-hook";
import BookingSuccess from "../components/BookingSuccess";
import BookingFail from "../components/BookingFail";
import RoomModal from "../components/RoomModal";

export function Rooms() {
  const { id } = useParams();
  const [data, setData] = useState([]);

  useEffect(() => {
    const getRoomInfo = async () => {
      const res = await axios.get(`${url}/${id}`, authorization);
      setData(res.data.room[0]);
    };
    getRoomInfo();
  }, []);

  const [state, setState] = useState([
    {
      startDate: addDays(new Date(), 1),
      endDate: addDays(new Date(), 2),
      key: "selection",
    },
  ]);

  // 處理日期套件

  // 用來抓預設日期
  let checkInDate = dayjs(state[0].startDate).format("YYYY-MM-DD");
  let checkOutDate = dayjs(state[0].endDate).format("YYYY-MM-DD");
  // 用來算天數
  const diffWithDay = dayjs(checkOutDate).diff(dayjs(checkInDate), "day");

  const {
    register,
    handleSubmit,
    setValue,
    control,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      tel: "",
      checkInDate: checkInDate,
      checkOutDate: checkOutDate,
    },
    mode: "onTouched",
  });
  const watchForm = useWatch({ control });
  useEffect(() => {
    const getResult = getValues();
    customerData.name = getResult.name;
    customerData.tel = getResult.tel;
    customerData.date = [getResult.checkInDate];
  }, [watchForm]);


  // 處理API POST
  const customerData = {
    name: "",
    tel: "",
    date: [],
  };
  const sendData = async () => {
    try {
      const res = await axios.post(`${url}/${id}`, customerData, authorization);
      setBgStatus(false);
      setSuccess(true);
      console.log(res.data);
    } catch (error) {
      setBgStatus(false);
      setFail(true);
      console.log(error);
    }
  };
  const [success, setSuccess] = useState(false);
  const closeSuccess = () => {
    setSuccess(false);
  };
  let showSuccess =
    success === true ? <BookingSuccess closeSuccess={closeSuccess} /> : "";

  const [fail, setFail] = useState(false);
  const closeFail = () => {
    setFail(false);
  };
  let showFail = fail === true ? <BookingFail closeFail={closeFail} /> : "";

  const [bgStatus, setBgStatus] = useState(false);
  const closeBg = () => {
    setBgStatus(false);
  };
  let showBg =
    bgStatus === true ? (
      <Dialog
        setBgStatus={setBgStatus}
        register={register}
        handleSubmit={handleSubmit}
        setValue={setValue}
        errors={errors}
        sendData={sendData}
        closeBg={closeBg}
      />
    ) : (
      ""
    );
  const BgSwitch = () => {
    switch (bgStatus) {
      case false:
        setBgStatus(true);
        break;
      default:
        break;
    }
  };

  const [open, setOpen] = useState(false);
  const toggleOpen = () => {
    setOpen(!open);
  };
  let showModal = open === true ? <RoomModal toggleOpen={toggleOpen} /> : "";
  // const BgSwitch = () => {
  //   switch (bgStatus) {
  //     case false:
  //       setBgStatus(true);
  //       break;
  //     default:
  //       break;
  //   }
  // };
  // ? 平日假日計算金額
  let price = calPrice();
  return (
    <>
    {data.length===0 ? <Loading text='傳 送 中  (⁎⁍̴̛ᴗ⁍̴̛⁎) '/> :null}
    <div className="animate-fadeIn RoomPage flex h-screen justify-between relative -z-10">
      {showFail}
      {showSuccess}
      {showBg}
      {showModal}
      {/* Nav */}
      <nav className="w-[42%] h-full flex flex-col justify-between fixed">
        {/* 輪播圖 */}
        <ModalProvider>
          <RoomCarousel data={data} toggleOpen={toggleOpen}/>
        </ModalProvider>
        {/* 返回首頁按鈕 */}
        <NavLink
          to="/"
          className="font-light text-sm 2xl:text-base 3xl:text-lg text-primary"
        >
        <button
          type="button"
          className="flex items-center relative mt-[87px] ml-[13vh]"
        >
          <img src={backHome} alt="backHome" className="m-[10px] " />
            查看其他房型
        </button>
          </NavLink>
        {/* 價格＆預約按鈕 */}
        <div className=" flex flex-col relative mb-[13vh] items-center">
          <div className="mb-[10px]">
            <span className="text-[36px] text-primary">{`$${price ? price.toLocaleString() : 0}`} </span>
            <span className="text-xl text-primary">{` / ${diffWithDay}晚`}</span>
          </div>

          <button
            type="button"
            onClick={BgSwitch}
            className="text-xl text-white bg-primary py-[8.5px] w-[252px] block hover:opacity-50"
          >
            Booking Now
          </button>
        </div>
      </nav>
      <div className="container flex">
        {/* 因nav改fixed出現的佔位格 */}
        <div className="w-[42%] mr-[30px] flex-shrink-0 "></div>
        {/* 房間細節 */}
        <div className=" mt-[13vh]  w-[635px] text-primary">
          <RoomDetail data={data} />
          <p className="text-primary text-sm font-medium mb-2 leading-6">
            空房狀態查詢
          </p>
          {/* 日曆佔位格 */}
          <DateRangePicker
            onChange={(item) => {
              setState([item.selection]);
              setValue("checkInDate", dayjs(item.selection.startDate).format("YYYY-MM-DD"));
              setValue("checkOutDate",dayjs(item.selection.endDate).format("YYYY-MM-DD"));
            }}
            showSelectionPreview={true}
            moveRangeOnFirstSelection={false}
            months={2}
            ranges={state}
            direction="horizontal"
            showMonthAndYearPickers={false}
            minDate={dayjs(state.startDate).add(1, "day").toDate()}
            maxDate={dayjs(state.startDate).add(90, "day").toDate()}
            color="rgb(56, 71, 11)"
            date={new Date(state.endDate)}
          />
        </div>
      </div>
    </div>
    </>
  );

  function calPrice() {
    const weekAry = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    let index = weekAry.indexOf(String(state[0].startDate).slice(0, 3)); // Tue
    let price = 0;
    let weekCount = index;
    for (let i = 0; i < diffWithDay; i++) {
      // console.log(weekCount);
      if (weekCount === 5 || weekCount === 6 || weekCount === 0) {
        price += data.holidayPrice;
      } else {
        price += data.normalDayPrice;
      }
      weekCount += 1;
      if (weekCount === 7) { weekCount = 0; }
    }
    return price;
  }
}
