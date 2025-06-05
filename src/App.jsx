import React, { useState, useEffect } from "react";

const elements = ["물", "불", "흙", "나무", "철"];
const states = ["맑음", "탁함"];
const STORAGE_KEY = "myGridData";

// 색상 매핑: 맑음(연한색), 탁함(진한색)
const colorMap = {
  물: { 맑음: "#a0c4ff", 탁함: "#023e8a" }, // 파랑
  불: { 맑음: "#ffadad", 탁함: "#9b0000" }, // 빨강
  철: { 맑음: "#d3d3d3", 탁함: "#4b4b4b" }, // 회색
  나무: { 맑음: "#b7e4c7", 탁함: "#2d6a4f" }, // 초록
  흙: { 맑음: "#d7b49e", 탁함: "#6b4226" }, // 갈색
};

function Cell({ cellData, onChange }) {
  const bgColor = colorMap[cellData.element][cellData.state];

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

export default function Grid() {
  const getInitialGrid = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
    return Array(3)
      .fill(null)
      .map(() =>
        Array(3)
          .fill(null)
          .map(() => ({ element: "물", state: "맑음" }))
      );
  };

  const [grid, setGrid] = useState(getInitialGrid);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(grid));
  }, [grid]);

  const handleCellChange = (rowIdx, colIdx, newCellData) => {
    setGrid((grid) =>
      grid.map((row, r) =>
        row.map((cell, c) => (r === rowIdx && c === colIdx ? newCellData : cell))
      )
    );
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        minWidth: "100vw",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "#f2f2f2",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 8,
          width: "100%",
          maxWidth: 340,
          margin: "0 auto",
          padding: "0 8px",
          boxSizing: "border-box",
        }}
      >
        {grid.map((row, r) =>
          row.map((cell, c) => (
            <Cell
              key={`${r}-${c}`}
              cellData={cell}
              onChange={(newCellData) => handleCellChange(r, c, newCellData)}
            />
          ))
        )}
      </div>
    </div>
  );
}
// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App

// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App
