import React, { useState, useEffect } from "react";

const elements = ["알 수 없음", "물", "불", "흙", "나무", "철"];
const states = ["맑음", "탁함"];
const STORAGE_KEY = "myGridsData";

// 색상 매핑: 맑음(연한색), 탁함(진한색)
const colorMap = {
  물: { 맑음: "#a0c4ff", 탁함: "#023e8a" }, // 파랑
  불: { 맑음: "#ffadad", 탁함: "#9b0000" }, // 빨강
  철: { 맑음: "#d3d3d3", 탁함: "#4b4b4b" }, // 회색
  나무: { 맑음: "#b7e4c7", 탁함: "#2d6a4f" }, // 초록
  흙: { 맑음: "#d7b49e", 탁함: "#6b4226" }, // 갈색
  "알 수 없음": { 맑음: "#ffffff", 탁함: "#808080" }, // 흰색/회색
};

function Cell({ cellData, onChange }) {
  const bgColor = colorMap[cellData.element][cellData.state] || "#ffffff"; // 기본 흰색

  return (
    <div
      style={{
        border: "1px solid #aaa",
        textAlign: "center",
        backgroundColor: bgColor,
        color: "#000",
        fontWeight: "bold",
        userSelect: "none",
        borderRadius: 4,
        minHeight: 0,
        width: "100%",
        aspectRatio: "1 / 1",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        boxSizing: "border-box",
        padding: 4,
      }}
    >
      <select
        value={cellData.element}
        onChange={(e) => onChange({ ...cellData, element: e.target.value })}
        style={{ marginBottom: 6, width: "90%" }}
      >
        {elements.map((el) => (
          <option key={el} value={el}>
            {el}
          </option>
        ))}
      </select>
      <select
        value={cellData.state}
        onChange={(e) => onChange({ ...cellData, state: e.target.value })}
        style={{ width: "90%" }}
      >
        {states.map((st) => (
          <option key={st} value={st}>
            {st}
          </option>
        ))}
      </select>
    </div>
  );
}

function Grid({ gridData, onChange, title, onTitleChange, onDelete }) {
  return (
    <div
      style={{
        marginBottom: 20,
        border: "1px solid #ccc",
        borderRadius: 8,
        padding: 16,
        backgroundColor: "#fff",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        position: "relative",
      }}
    >
      <input
        type="text"
        placeholder="제목을 입력하세요"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        style={{
          width: "100%",
          marginBottom: 12,
          padding: 8,
          boxSizing: "border-box",
          border: "1px solid #ddd",
          borderRadius: 4,
        }}
      />
      <button
        onClick={onDelete}
        style={{
          position: "absolute",
          top: 8,
          right: 8,
          backgroundColor: "#e74c3c",
          color: "white",
          border: "none",
          borderRadius: "50%",
          width: 30,
          height: 30,
          cursor: "pointer",
          fontWeight: "bold",
          fontSize: 18,
          lineHeight: "30px",
          textAlign: "center",
          padding: 0,
        }}
        title="삭제"
      >
        &times;
      </button>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 8,
          width: "100%",
          maxWidth: 340,
          margin: "0 auto",
          boxSizing: "border-box",
        }}
      >
        {gridData.map((row, r) =>
          row.map((cell, c) => (
            <Cell
              key={`${r}-${c}`}
              cellData={cell}
              onChange={(newCellData) => onChange(r, c, newCellData)}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default function App() {
  const getInitialGrids = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
    return [
      {
        title: "새로운 칸",
        grid: Array(3)
          .fill(null)
          .map(() =>
            Array(3)
              .fill(null)
              .map(() => ({ element: "물", state: "맑음" }))
          ),
      },
    ];
  };

  const [grids, setGrids] = useState(getInitialGrids);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(grids));
  }, [grids]);

  const handleCellChange = (gridIndex, rowIdx, colIdx, newCellData) => {
    setGrids((grids) =>
      grids.map((gridItem, index) =>
        index === gridIndex
          ? {
              ...gridItem,
              grid: gridItem.grid.map((row, r) =>
                row.map((cell, c) => (r === rowIdx && c === colIdx ? newCellData : cell))
              ),
            }
          : gridItem
      )
    );
  };

  const handleAddGrid = () => {
    setGrids([
      ...grids,
      {
        title: "새로운 칸",
        grid: Array(3)
          .fill(null)
          .map(() =>
            Array(3)
              .fill(null)
              .map(() => ({ element: "물", state: "맑음" }))
          ),
      },
    ]);
  };

  const handleTitleChange = (gridIndex, newTitle) => {
    setGrids((grids) =>
      grids.map((gridItem, index) =>
        index === gridIndex ? { ...gridItem, title: newTitle } : gridItem
      )
    );
  };

  const handleDeleteGrid = (gridIndex) => {
    setGrids((grids) => grids.filter((_, index) => index !== gridIndex));
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        minWidth: "100vw",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        background: "#f2f2f2",
        padding: 20,
        boxSizing: "border-box",
      }}
    >
      <h2 style={{ marginBottom: 20 }}>오행공격 메모장</h2>
      {grids.map((gridItem, index) => (
        <Grid
          key={index}
          title={gridItem.title}
          gridData={gridItem.grid}
          onChange={(rowIdx, colIdx, newCellData) =>
            handleCellChange(index, rowIdx, colIdx, newCellData)
          }
          onTitleChange={(newTitle) => handleTitleChange(index, newTitle)}
          onDelete={() => handleDeleteGrid(index)}
        />
      ))}
      <button
        onClick={handleAddGrid}
        style={{
          backgroundColor: "#4CAF50",
          color: "white",
          padding: "10px 20px",
          fontSize: "16px",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          marginTop: 10,
        }}
      >
        + 칸 추가
      </button>
    </div>
  );
}
