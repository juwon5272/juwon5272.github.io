import React, { useState, useEffect, useMemo } from "react";

const STORAGE_KEY = "cardGameMemoData";

// Generate 52 standard playing cards
const generateDeck = () => {
  const suits = ["❤️", "♦️", "♠️", "♣️"];
  const suitNames = { "❤️": "Hearts", "♦️": "Diamonds", "♠️": "Spades", "♣️": "Clubs" };
  const ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

  const deck = [];
  suits.forEach((suit) => {
    ranks.forEach((rank, idx) => {
      deck.push({
        id: `${suit}-${rank}`,
        display: `${suit}${rank}`,
        suit,
        suitName: suitNames[suit],
        rank,
        value: idx + 1,
      });
    });
  });
  return deck;
};

const DECK = generateDeck();

// Card selector component with autocomplete
function CardSelector({
  value,
  onChange,
  usedCards,
  placeholder = "카드 선택",
  compact = false,
}) {
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const availableCards = useMemo(() => {
    return DECK.filter((card) => !usedCards.includes(card.id));
  }, [usedCards]);

  const filteredCards = useMemo(() => {
    if (!search) return availableCards;
    const searchLower = search.toLowerCase();
    return availableCards.filter(
      (card) =>
        card.display.toLowerCase().includes(searchLower) ||
        card.rank.toLowerCase().includes(searchLower) ||
        card.suitName.toLowerCase().includes(searchLower)
    );
  }, [search, availableCards]);

  const selectedCard = DECK.find((c) => c.id === value);

  const handleSelect = (cardId) => {
    onChange(cardId);
    setSearch("");
    setShowDropdown(false);
  };

  const handleClear = () => {
    onChange("");
    setSearch("");
    setShowDropdown(false);
  };

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <div style={{ display: "flex", gap: 4 }}>
        <input
          type="text"
          value={search || (selectedCard ? selectedCard.display : "")}
          onChange={(e) => {
            setSearch(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          placeholder={placeholder}
          style={{
            flex: 1,
            padding: compact ? "4px 6px" : "4px 8px",
            border: "1px solid #ddd",
            borderRadius: 4,
            fontSize: compact ? "0.85rem" : "0.9rem",
            backgroundColor: selectedCard ? "#e8f5e9" : "white",
            width: "30px",
          }}
        />
      </div>

      {showDropdown && (
        <>
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 999,
            }}
            onClick={() => setShowDropdown(false)}
          />
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              maxHeight: 200,
              overflowY: "auto",
              backgroundColor: "white",
              border: "1px solid #ddd",
              borderRadius: 4,
              marginTop: 2,
              zIndex: 1000,
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            }}
          >
            <div
              onClick={handleClear}
              style={{
                padding: "6px 0px",
                cursor: "pointer",
                backgroundColor: "#fff3e0",
                borderBottom: "2px solid #ff9800",
                fontSize: "0.9rem",
                fontWeight: "bold",
                color: "#ff6f00",
                textAlign: "center",
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#ffe0b2")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#fff3e0")}
            >
              취소
            </div>
            {filteredCards.map((card) => (
              <div
                key={card.id}
                onClick={() => handleSelect(card.id)}
                style={{
                  padding: "6px 10px",
                  cursor: "pointer",
                  backgroundColor: "white",
                  borderBottom: "1px solid #eee",
                  fontSize: "0.9rem",
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = "#f5f5f5")}
                onMouseLeave={(e) => (e.target.style.backgroundColor = "white")}
              >
                {card.display}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// Round tracker component
function RoundTracker({ round, onChange, usedCards }) {
  const handleCardChange = (index, cardId) => {
    const newCards = [...round.revealedCards];
    newCards[index] = cardId;
    onChange({ ...round, revealedCards: newCards });
  };

  const cardCount = round.revealedCards.length;

  return (
    <div
      style={{
        border: "2px solid #9c27b0",
        borderRadius: 8,
        padding: "12px",
        backgroundColor: "#f3e5f5",
        marginBottom: 12,
      }}
    >
      <div
        style={{
          fontWeight: "bold",
          marginBottom: 8,
          fontSize: "0.95rem",
          color: "#9c27b0",
        }}
      >
        라운드 {round.roundNumber} - 공개된 카드 ({cardCount}장)
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(50px, 1fr))",
          gap: 6,
        }}
      >
        {round.revealedCards.map((_, i) => (
          <CardSelector
            key={i}
            value={round.revealedCards[i] || ""}
            onChange={(cardId) => handleCardChange(i, cardId)}
            usedCards={[]}
            placeholder={`${i + 1}`}
            compact={true}
          />
        ))}
      </div>
    </div>
  );
}

// Player card input component
function PlayerCards({
  player,
  onChange,
  usedCards,
  showChips = false,
  showOrder = false,
}) {
  const handleCardChange = (index, cardId) => {
    const newCards = [...player.cards];
    newCards[index] = cardId;
    onChange({ ...player, cards: newCards });
  };

  const handleNameChange = (name) => {
    onChange({ ...player, name });
  };

  const handleChipsChange = (chips) => {
    onChange({ ...player, chips: parseInt(chips) || 0 });
  };

  const handleOrderChange = (order) => {
    onChange({ ...player, order: parseInt(order) || 0 });
  };

  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: 8,
        padding: "10px",
        backgroundColor: "#fafafa",
        marginBottom: 10,
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 6,
          marginBottom: 8,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <input
          type="text"
          value={player.name}
          onChange={(e) => handleNameChange(e.target.value)}
          placeholder="플레이어 이름"
          style={{
            padding: "5px 8px",
            border: "1px solid #ddd",
            borderRadius: 4,
            fontWeight: "bold",
            flex: "1 1 120px",
            minWidth: 100,
            fontSize: "0.9rem",
          }}
        />
        {showChips && (
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <label style={{ fontSize: "0.8rem", whiteSpace: "nowrap" }}>칩:</label>
            <input
              type="number"
              value={player.chips}
              onChange={(e) => handleChipsChange(e.target.value)}
              style={{
                width: 60,
                padding: "4px 6px",
                border: "1px solid #ddd",
                borderRadius: 4,
                fontSize: "0.85rem",
              }}
            />
          </div>
        )}
        {showOrder && (
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <label style={{ fontSize: "0.8rem", whiteSpace: "nowrap" }}>순서:</label>
            <input
              type="number"
              value={player.order}
              onChange={(e) => handleOrderChange(e.target.value)}
              style={{
                width: 10,
                padding: "4px 6px",
                border: "1px solid #ddd",
                borderRadius: 4,
                fontSize: "0.85rem",
              }}
            />
          </div>
        )}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(45px, 1fr))",
          gap: 6,
        }}
      >
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i}>
            <div style={{ fontSize: "0.7rem", marginBottom: 2, color: "#666" }}>
              카드{i + 1}
            </div>
            <CardSelector
              value={player.cards[i]}
              onChange={(cardId) => handleCardChange(i, cardId)}
              usedCards={usedCards.filter((id) => id !== player.cards[i])}
              placeholder={`${i + 1}`}
              compact={true}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// Opponent team section
function OpponentTeam({ opponents, onChange, usedCards }) {
  const handleSuitCardChange = (suit, value) => {
    const newSuitCards = { ...opponents.suitCards, [suit]: value };
    onChange({ ...opponents, suitCards: newSuitCards });
  };

  const handlePlayerChange = (index, player) => {
    const newPlayers = [...opponents.players];
    newPlayers[index] = player;
    onChange({ ...opponents, players: newPlayers });
  };

  const suits = ["❤️", "♦️", "♠️", "♣️"];

  return (
    <div
      style={{
        border: "2px solid #ff5722",
        borderRadius: 8,
        padding: "12px",
        backgroundColor: "#fff3e0",
        marginBottom: 16,
      }}
    >
      <h3
        style={{ marginTop: 0, marginBottom: 10, color: "#ff5722", fontSize: "1.1rem" }}
      >
        상대팀 (Opponents)
      </h3>

      <div style={{ marginBottom: 12 }}>
        <label
          style={{
            display: "block",
            fontWeight: "bold",
            marginBottom: 8,
            fontSize: "0.9rem",
          }}
        >
          상대팀 보유 추정 카드 (문양별):
        </label>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {suits.map((suit) => (
            <div key={suit} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontWeight: "bold", fontSize: "1.1rem", minWidth: 30 }}>
                {suit}
              </span>
              <input
                type="text"
                value={opponents.suitCards?.[suit] || ""}
                onChange={(e) => handleSuitCardChange(suit, e.target.value)}
                placeholder="예: A,3,5,7,9,J,K"
                style={{
                  flex: 1,
                  padding: "6px 10px",
                  border: "1px solid #ddd",
                  borderRadius: 4,
                  fontFamily: "monospace",
                  fontSize: "0.85rem",
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <div
        style={{ fontWeight: "bold", marginBottom: 8, marginTop: 16, fontSize: "0.9rem" }}
      >
        개별 플레이어 추정:
      </div>
      {opponents.players.map((player, index) => (
        <PlayerCards
          key={index}
          player={player}
          onChange={(updatedPlayer) => handlePlayerChange(index, updatedPlayer)}
          usedCards={usedCards}
          showChips={true}
          showOrder={true}
        />
      ))}
    </div>
  );
}

// Main component
export default function CardGameMemo() {
  const getInitialState = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved data", e);
      }
    }

    return {
      rounds: Array(6)
        .fill(null)
        .map((_, i) => ({
          roundNumber: i + 1,
          revealedCards:
            (i + 1) % 2 === 1
              ? ["", "", "", "", "", "", "", ""] // 홀수 라운드: 8장
              : ["", "", "", "", "", "", "", "", ""], // 짝수 라운드: 9장
        })),
      ourTeam: Array(4)
        .fill(null)
        .map((_, i) => ({
          name: `우리팀 ${i + 1}`,
          cards: ["", "", "", "", "", ""],
          chips: 0,
          order: i + 1,
        })),
      opponents: {
        suitCards: {
          "❤️": "",
          "♦️": "",
          "♠️": "",
          "♣️": "",
        },
        players: Array(4)
          .fill(null)
          .map((_, i) => ({
            name: `상대팀 ${i + 1}`,
            cards: ["", "", "", "", "", ""],
            chips: 0,
            order: i + 5,
          })),
      },
    };
  };

  const [gameState, setGameState] = useState(getInitialState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
  }, [gameState]);

  // Calculate used cards only for our team and opponents (not rounds)
  const usedCards = useMemo(() => {
    const cards = [];
    if (gameState.ourTeam) {
      gameState.ourTeam.forEach((player) => {
        if (player && player.cards) {
          player.cards.forEach((card) => {
            if (card) cards.push(card);
          });
        }
      });
    }
    if (gameState.opponents && gameState.opponents.players) {
      gameState.opponents.players.forEach((player) => {
        if (player && player.cards) {
          player.cards.forEach((card) => {
            if (card) cards.push(card);
          });
        }
      });
    }
    return cards;
  }, [gameState]);

  // Calculate unrevealed cards (cards not revealed in rounds)
  const unrevealedCards = useMemo(() => {
    const revealedCardIds = [];

    if (gameState.rounds) {
      gameState.rounds.forEach((round) => {
        if (round && round.revealedCards) {
          round.revealedCards.forEach((card) => {
            if (card) revealedCardIds.push(card);
          });
        }
      });
    }

    return DECK.filter((card) => !revealedCardIds.includes(card.id));
  }, [gameState]);

  // Group unrevealed cards by suit
  const unrevealedCardsBySuit = useMemo(() => {
    const grouped = { "❤️": [], "♦️": [], "♠️": [], "♣️": [] };

    unrevealedCards.forEach((card) => {
      grouped[card.suit].push(card);
    });

    // Sort each suit by value
    Object.keys(grouped).forEach((suit) => {
      grouped[suit].sort((a, b) => a.value - b.value);
    });

    return grouped;
  }, [unrevealedCards]);

  const handleRoundChange = (index, round) => {
    const newRounds = [...gameState.rounds];
    newRounds[index] = round;
    setGameState({ ...gameState, rounds: newRounds });
  };

  const handleOurTeamChange = (index, player) => {
    const newOurTeam = [...gameState.ourTeam];
    newOurTeam[index] = player;
    setGameState({ ...gameState, ourTeam: newOurTeam });
  };

  const handleOpponentsChange = (opponents) => {
    setGameState({ ...gameState, opponents });
  };

  const handleReset = () => {
    if (window.confirm("모든 데이터를 초기화하시겠습니까?")) {
      localStorage.removeItem(STORAGE_KEY);
      setGameState(getInitialState());
    }
  };

  const cardsUsed = usedCards.length;
  const cardsRemaining = 52 - cardsUsed;

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        padding: "12px",
        boxSizing: "border-box",
      }}
    >
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          <h1 style={{ margin: 0, fontSize: "1.4rem" }}>8인 팀 카드 게임 메모</h1>
          <button
            onClick={handleReset}
            style={{
              padding: "6px 12px",
              backgroundColor: "#f44336",
              color: "white",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "0.85rem",
            }}
          >
            초기화
          </button>
        </div>

        <div
          style={{
            backgroundColor: "#e3f2fd",
            padding: 10,
            borderRadius: 8,
            marginBottom: 16,
            display: "flex",
            gap: 16,
            flexWrap: "wrap",
            fontSize: "0.9rem",
          }}
        >
          <div>
            <strong>사용된 카드:</strong> {cardsUsed} / 52
          </div>
          <div>
            <strong>남은 카드:</strong> {cardsRemaining}
          </div>
        </div>

        {/* Unrevealed Cards Section */}
        <div
          style={{
            border: "2px solid #4caf50",
            borderRadius: 8,
            padding: "12px",
            backgroundColor: "#e8f5e9",
            marginBottom: 16,
          }}
        >
          <h2
            style={{
              marginTop: 0,
              marginBottom: 10,
              color: "#4caf50",
              fontSize: "1.1rem",
            }}
          >
            공개되지 않은 카드 ({unrevealedCards.length}장)
          </h2>
          <div style={{ fontSize: "0.85rem", marginBottom: 8, color: "#666" }}>
            라운드별 공개 카드를 제외한 나머지 카드들
          </div>
          <div
            style={{
              padding: 8,
              backgroundColor: "white",
              borderRadius: 4,
              border: "1px solid #ddd",
            }}
          >
            {unrevealedCards.length > 0 ? (
              Object.entries(unrevealedCardsBySuit).map(
                ([suit, cards]) =>
                  cards.length > 0 && (
                    <div
                      key={suit}
                      style={{
                        marginBottom: 8,
                        fontSize: "0.85rem",
                        display: "flex",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: 4,
                      }}
                    >
                      <span
                        style={{ fontWeight: "bold", fontSize: "1rem", minWidth: 30 }}
                      >
                        {suit}:
                      </span>
                      {cards.map((card) => (
                        <span
                          key={card.id}
                          style={{
                            padding: "2px 6px",
                            backgroundColor: "#f5f5f5",
                            borderRadius: 3,
                            border: "1px solid #ddd",
                          }}
                        >
                          {card.rank}
                        </span>
                      ))}
                    </div>
                  )
              )
            ) : (
              <div style={{ color: "#999", fontSize: "0.85rem" }}>
                모든 카드가 배정되었습니다
              </div>
            )}
          </div>
        </div>

        {/* Rounds Section */}
        <div style={{ marginBottom: 16 }}>
          <h2
            style={{ margin: 0, marginBottom: 12, fontSize: "1.2rem", color: "#9c27b0" }}
          >
            라운드별 공개 카드
          </h2>
          {gameState.rounds &&
            gameState.rounds.map((round, index) => (
              <RoundTracker
                key={index}
                round={round}
                onChange={(updatedRound) => handleRoundChange(index, updatedRound)}
                usedCards={usedCards}
              />
            ))}
        </div>

        {/* Our Team Section */}
        <div
          style={{
            border: "2px solid #2196f3",
            borderRadius: 8,
            padding: "12px",
            backgroundColor: "#e3f2fd",
            marginBottom: 16,
          }}
        >
          <h2
            style={{
              marginTop: 0,
              marginBottom: 10,
              color: "#2196f3",
              fontSize: "1.1rem",
            }}
          >
            우리팀 (Our Team)
          </h2>
          {gameState.ourTeam &&
            gameState.ourTeam.map((player, index) => (
              <PlayerCards
                key={index}
                player={player}
                onChange={(updatedPlayer) => handleOurTeamChange(index, updatedPlayer)}
                usedCards={usedCards}
                showChips={true}
                showOrder={true}
              />
            ))}
        </div>

        {/* Opponent Team Section */}
        <OpponentTeam
          opponents={gameState.opponents}
          onChange={handleOpponentsChange}
          usedCards={usedCards}
        />
      </div>
    </div>
  );
}
