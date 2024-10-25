import { useReducer } from "react";

const initialState = {
  totalMealCost: "",
  peopleCount: 0,
  people: [],
  result: [],
  drinks: { beer: "", soda: "", water: "" },
  totalBill: 0,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_TOTAL_MEAL_COST":
      return { ...state, totalMealCost: action.payload };
    case "ADD_PERSON":
      return {
        ...state,
        peopleCount: state.peopleCount + 1,
        people: [...state.people, { name: "", drinkType: "" }],
      };
    case "SET_PERSON_NAME":
      const updatedPeopleName = [...state.people];
      updatedPeopleName[action.index].name = action.payload;
      return { ...state, people: updatedPeopleName };
    case "SET_DRINK_TYPE":
      const updatedDrinkType = [...state.people];
      updatedDrinkType[action.index].drinkType = action.payload;
      return { ...state, people: updatedDrinkType };
    case "SET_DRINK_PRICE":
      return {
        ...state,
        drinks: { ...state.drinks, [action.drinkType]: action.payload },
      };
    case "CALCULATE_RESULT": {
      const mealTotal = Number(state.totalMealCost.replace(/\./g, "")) || 0;

      const drinkTotals = ["beer", "soda", "water"].reduce((acc, drink) => {
        acc[drink] = Number(state.drinks[drink].replace(/\./g, "")) || 0;
        return acc;
      }, {});

      const adjustedMealTotal =
        mealTotal - Object.values(drinkTotals).reduce((a, b) => a + b, 0);
      const perPersonMealCost = adjustedMealTotal / state.peopleCount;

      const result = state.people.map((person) => {
        const drinkCostPerPerson = person.drinkType
          ? drinkTotals[person.drinkType] /
            state.people.filter((p) => p.drinkType === person.drinkType).length
          : 0;

        const amountDue = perPersonMealCost + drinkCostPerPerson;

        return { ...person, amountDue };
      });

      return { ...state, result };
    }

    default:
      return state;
  }
}

function formatNumber(value) {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function PartyBill({ data }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleInputChange = (type, value) => {
    const numericValue = value.replace(/\./g, "");
    if (!isNaN(numericValue)) {
      dispatch({ type, payload: formatNumber(numericValue) });
    }
  };

  const handlePersonNameChange = (index, value) => {
    dispatch({
      type: "SET_PERSON_NAME",
      payload: value,
      index,
    });
  };

  const handleDrinkTypeChange = (index, value) => {
    dispatch({
      type: "SET_DRINK_TYPE",
      payload: value,
      index,
    });
  };

  const handleDrinkPriceChange = (drinkType, value) => {
    const numericValue = value.replace(/\./g, "");
    if (!isNaN(numericValue)) {
      dispatch({
        type: "SET_DRINK_PRICE",
        payload: formatNumber(numericValue),
        drinkType,
      });
    }
  };

  const handleSubmit = () => {
    dispatch({ type: "CALCULATE_RESULT" });
  };

  return (
    <div className="container py-40">
      <div className="px-16">
        <div className="flex gap-16 flex-wrap flex-justify-between">
          <div className="flex flex-1 flex-column gap-10">
            <label className="flex flex-justify-between">
              Tổng giá món ăn:{" "}
              <input
                className="flex-input-60"
                type="text"
                value={state.totalMealCost}
                onChange={(e) =>
                  handleInputChange("SET_TOTAL_MEAL_COST", e.target.value)
                }
              />
            </label>
            {["beer", "soda", "water"].map((drinkType) => (
              <label key={drinkType} className="flex flex-justify-between">
                Giá{" "}
                {drinkType === "beer"
                  ? "Bia"
                  : drinkType === "soda"
                  ? "Nước ngọt"
                  : "Nước lọc"}
                :{" "}
                <input
                  className="flex-input-60"
                  type="text"
                  value={state.drinks[drinkType]}
                  onChange={(e) =>
                    handleDrinkPriceChange(drinkType, e.target.value)
                  }
                />
              </label>
            ))}
          </div>
          <div className="flex flex-2 gap-10 flex-column">
            <button
              className="button-150 select-name"
              onClick={() => dispatch({ type: "ADD_PERSON" })}
            >
              + Thêm người
            </button>
            {state.people.map((person, index) => (
              <div key={index} className="flex flex-column gap-4">
                <label>
                  <select
                    className="select-name"
                    value={person.name}
                    onChange={(e) =>
                      handlePersonNameChange(index, e.target.value)
                    }
                  >
                    <option value="">Người chơi</option>
                    {data.map((name, idx) => (
                      <option key={idx} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Loại đồ uống:{" "}
                  <select
                    className="select-name"
                    value={person.drinkType}
                    onChange={(e) =>
                      handleDrinkTypeChange(index, e.target.value)
                    }
                  >
                    <option value="">Chọn đồ uống</option>
                    <option value="beer">Bia</option>
                    <option value="soda">Nước ngọt</option>
                    <option value="water">Nước lọc</option>
                  </select>
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-column py-20">
          <div className="text-center">
            <button className="button-150 select-name" onClick={handleSubmit}>
              Chia tiền ăn
            </button>
          </div>
          {state.result.length > 0 && (
            <table className="py-20">
              <thead>
                <tr>
                  <th>Tên người đặt</th>
                  <th>Số tiền cần chi trả</th>
                </tr>
              </thead>
              <tbody>
                {state.result.map((res, index) => (
                  <tr key={index}>
                    <td>{res.name}</td>
                    <td>{formatNumber(res.amountDue.toFixed())}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default PartyBill;
