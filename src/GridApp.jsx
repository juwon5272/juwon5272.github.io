import React, { useState, useEffect } from "react";

const elements = ["알 수 없음", "물", "불", "흙", "나무", "철"];
const states = ["맑음", "탁함"];
const STORAGE_KEY = "myGridsWithReactions";

// 색상 매핑
const colorMap = {
  물: { 맑음: "#a0c4ff", 탁함: "#023e8a" },
  불: { 맑음: "#ffadad", 탁함: "#9b0000" },
  철: { 맑음: "#d3d3d3", 탁함: "#4b4b4b" },
  나무: { 맑음: "#b7e4c7", 탁함: "#2d6a4f" },
  흙: { 맑음: "#d7b49e", 탁함: "#6b4226" },
  "알 수 없음": { 맑음: "#ffffff", 탁함: "#808080" },
};

// 반응 로그용 선탱 항목
const actors = ["감자", "찐", "넛", "루비", "탱", "게스트"];
const actions = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const results = ["O", "X"];

function Cell({ cellData, onChange }) {
  const bgColor = colorMap[cellData.element]?.[cellData.state] || "#ffffff";

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

function ReactionEntry({ entry, onEntryChange, onDelete }) {
  const handleChange = (field, value) => {
    onEntryChange({ ...entry, [field]: value });
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        marginBottom: 8,
      }}
    >
      <select
        value={entry.actor1}
        onChange={(e) => handleChange("actor1", e.target.value)}
        style={{ marginRight: 4 }}
      >
        {["감자", "찐", "넛", "루비", "탱", "게스트"].map((actor) => (
          <option key={actor} value={actor}>
            {actor}
          </option>
        ))}
      </select>
      <select
        value={entry.action1}
        onChange={(e) => handleChange("action1", e.target.value)}
        style={{ marginRight: 4 }}
      >
        {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((action) => (
          <option key={action} value={action}>
            {action}
          </option>
        ))}
      </select>
      <span>→</span>
      <select
        value={entry.actor2}
        onChange={(e) => handleChange("actor2", e.target.value)}
        style={{ marginLeft: 4, marginRight: 4 }}
      >
        {["감자", "찐", "넛", "루비", "탱", "게스트"].map((actor) => (
          <option key={actor} value={actor}>
            {actor}
          </option>
        ))}
      </select>
      <select
        value={entry.action2}
        onChange={(e) => handleChange("action2", e.target.value)}
        style={{ marginLeft: 4, marginRight: 4 }}
      >
        {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((action) => (
          <option key={action} value={action}>
            {action}
          </option>
        ))}
      </select>
      <select
        value={entry.result}
        onChange={(e) => handleChange("result", e.target.value)}
        style={{ marginLeft: 4, marginRight: 4 }}
      >
        {["O", "X"].map((result) => (
          <option key={result} value={result}>
            {result}
          </option>
        ))}
      </select>
      <button
        onClick={onDelete}
        style={{
          padding: "3px 7px",
          fontSize: "0.75rem",
          backgroundColor: "#e74c3c",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          marginLeft: "auto",
        }}
      >
        삭제
      </button>
    </div>
  );
}

function ReactionArea({ reactions, onAddReaction, onEntryChange, onDeleteReaction }) {
  return (
    <div
      style={{
        marginBottom: 20,
        border: "1px solid #ccc",
        borderRadius: 8,
        padding: 16,
        backgroundColor: "#fff",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        width: "100%",
        maxWidth: 600,
        boxSizing: "border-box",
      }}
    >
      <h3 style={{ marginBottom: 10 }}>상호작용 기록</h3>
      {reactions.map((entry, index) => (
        <ReactionEntry
          key={index}
          entry={entry}
          onEntryChange={(updatedEntry) => onEntryChange(index, updatedEntry)}
          onDelete={() => onDeleteReaction(index)}
        />
      ))}
      <button
        onClick={onAddReaction}
        style={{
          padding: "3px 7px",
          fontSize: "0.75rem",
          backgroundColor: "green",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        + 기록 추가
      </button>
    </div>
  );
}

export default function GridApp() {
  const getInitialState = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
    return {
      grids: [
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
      ],
      reactions: [
        {
          actor1: "감자",
          action1: "1",
          actor2: "감자",
          action2: "1",
          result: "O",
        },
      ],
    };
  };

  const [state, setState] = useState(getInitialState);
  const { grids, reactions } = state;

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const handleReactionAdd = () => {
    setState({
      ...state,
      reactions: [
        ...reactions,
        {
          actor1: "감자",
          action1: "1",
          actor2: "감자",
          action2: "1",
          result: "O",
        },
      ],
    });
  };

  const handleReactionChange = (index, updatedEntry) => {
    const newReactions = [...reactions];
    newReactions[index] = updatedEntry;
    setState({ ...state, reactions: newReactions });
  };

  const handleReactionDelete = (index) => {
    const newReactions = [...reactions];
    newReactions.splice(index, 1);
    setState({ ...state, reactions: newReactions });
  };

  const handleGridAdd = () => {
    setState({
      ...state,
      grids: [
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
      ],
    });
  };

  const handleGridChange = (gridIndex, rowIdx, colIdx, newCellData) => {
    const newGrids = [...grids];
    newGrids[gridIndex] = {
      ...newGrids[gridIndex],
      grid: newGrids[gridIndex].grid.map((row, r) =>
        row.map((cell, c) => (r === rowIdx && c === colIdx ? newCellData : cell))
      ),
    };
    setState({ ...state, grids: newGrids });
  };

  const handleGridTitleChange = (index, newTitle) => {
    const newGrids = [...grids];
    newGrids[index] = { ...newGrids[index], title: newTitle };
    setState({ ...state, grids: newGrids });
  };

  const handleGridDelete = (index) => {
    const newGrids = [...grids];
    newGrids.splice(index, 1);
    setState({ ...state, grids: newGrids });
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

      <ReactionArea
        reactions={reactions}
        onAddReaction={handleReactionAdd}
        onEntryChange={handleReactionChange}
        onDeleteReaction={handleReactionDelete}
      />

      {grids.map((gridItem, index) => (
        <Grid
          key={index}
          title={gridItem.title}
          gridData={gridItem.grid}
          onChange={(rowIdx, colIdx, newCellData) =>
            handleGridChange(index, rowIdx, colIdx, newCellData)
          }
          onTitleChange={(newTitle) => handleGridTitleChange(index, newTitle)}
          onDelete={() => handleGridDelete(index)}
        />
      ))}
      <button
        onClick={handleGridAdd}
        style={{
          backgroundColor: "green",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        + 칸 추가
      </button>
    </div>
  );
}
