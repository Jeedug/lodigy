import React, { useRef, useState } from "react";
import Paragraph from "./Paragraph";
import Title from "./Title";
import { motion } from "framer-motion";

function AddParagraphInRow({ setIsHoveringEdit, setWantsto }) {
  const initialPosition = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const elementRef = useRef(null);

  const handleMouseDown = (event) => {
    initialPosition.current = event.clientX;
    setIsDragging(true);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (event) => {
    const elementPosX = elementRef.current.getBoundingClientRect().x
    if (elementPosX > event.clientX + 50) {
      setWantsto("delete")
    } else {
      setWantsto("add")
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    initialPosition.current = null;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  return (
    <div
      onMouseEnter={() => {
        setIsHoveringEdit(true);
      }}
      onMouseLeave={() => {
        setIsHoveringEdit(false);
      }}
      onMouseDown={handleMouseDown}
      className="h-full w-[6px] absolute -right-1 cursor-pointer hover:bg-black/50 animate-pulse transition rounded-full text-[12px] z-10"
      ref={elementRef}
    ></div>
  );
}
function RowItem({ rowIndex, colIndex, rowData }) {
  const [isHoveringEdit, setIsHoveringEdit] = useState(false);
  const [wantsTo, setWantsTo] = useState("");

  return (
    <>
      <div
        key={`${rowIndex}-${colIndex}`}
        style={{
          paddingLeft: colIndex > 0 ? "8px" : "0px",
          color: wantsTo === "delete" ? "#b23f3f" : "#000000",
        }}
        className=" h-[10px] items-center flex flex-row gap-2 py-3 pr-2 relative"
      >
        {rowData.type === "paragraph" ? (
          <Paragraph key={rowIndex} colData={rowData} colIndex={rowIndex} />
        ) : (
          <Title key={rowIndex} colData={rowData} colIndex={rowIndex} customStyle={{ color: wantsTo === "delete" ? "#b23f3f" : "#000000", }} />
        )}

        <AddParagraphInRow setWantsto={setWantsTo} setIsHoveringEdit={setIsHoveringEdit} />
      </div>

      {isHoveringEdit ? (
        <motion.div
          key={`${rowIndex}-${colIndex}`}
          style={{
            paddingLeft: colIndex > 0 ? "8px" : "0px",
          }}
          className=" h-[10px] pl-5 ml-2 items-center whitespace-nowrap flex flex-row gap-2 py-3  pr-2 relative text-gray-400"
          initial={{ opacity: 0, y: -10, width: 0 }}
          animate={{ opacity: 1, y: 0, width: "auto" }}
          transition={{ duration: 0.2 }}
        >
          {"New paragraph"}
        </motion.div>
      ) : ""}
    </>
  );
}

export default function Row({ rowIndex, item }) {
  return (
    <div className="  flex flex-row items-center relative border border-l-transparent border-r-transparent border-b-transparent">
      {item.data.map((rowData, colIndex) => (
        <RowItem colindex={colIndex} rowIndex={rowIndex} rowData={rowData} />
      ))}
    </div>
  );
}