
import { useReducer } from "react";

const initialState = {
  tempTotal: "",
  actualTotal: "",
  peopleCount: 0,
  people: [],
  result: [],
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_TEMP_TOTAL":
      return { ...state, tempTotal: action.payload };
    case "SET_ACTUAL_TOTAL":
      return { ...state, actualTotal: action.payload };
    case "ADD_PERSON":
      return {
        ...state,
        peopleCount: state.peopleCount + 1,
        people: [...state.people, { name: "", mealPrice: "" }],
      };
    case "SET_PERSON_NAME":
      const updatedPeopleName = [...state.people];
      updatedPeopleName[action.index].name = action.payload;
      return { ...state, people: updatedPeopleName };
    case "SET_MEAL_PRICE":
      const updatedPeoplePrice = [...state.people];
      updatedPeoplePrice[action.index].mealPrice = action.payload;
      return { ...state, people: updatedPeoplePrice };
    case "CALCULATE_RESULT":
      const discountPerPerson =
        (Number(state.tempTotal.replace(/\./g, "")) -
          Number(state.actualTotal.replace(/\./g, ""))) /
        state.peopleCount;
      const result = state.people.map((person) => {
        const priceNumber = Number(person.mealPrice.replace(/\./g, ""));
        const amountDue = priceNumber - discountPerPerson;
        return { ...person, amountDue };
      });
      return { ...state, result };
    default:
      return state;
  }
}

function formatNumber(value) {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
function BillGrab({ data }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleInputChange = (type, value) => {
    const numericValue = value.replace(/\./g, "");
    if (!isNaN(numericValue)) {
      dispatch({ type, payload: formatNumber(numericValue) });
    }
  };

  const handleMealPriceChange = (index, value) => {
    const numericValue = value.replace(/\./g, "");
    if (!isNaN(numericValue)) {
      dispatch({
        type: "SET_MEAL_PRICE",
        payload: formatNumber(numericValue),
        index,
      });
    }
  };

  const handlePersonNameChange = (index, value) => {
    dispatch({
      type: "SET_PERSON_NAME",
      payload: value,
      index,
    });
  };

  const handleSubmit = () => {
    dispatch({ type: "CALCULATE_RESULT" });
  };

  return (
    <div className="container py-40">
      <div className="px-16">
        <div className="flex gap-16 flex-wrap flex-justify-between">
          <div className="flex flex-1 flex-column gap-10">
            <label className=" flex flex-justify-between">
              Tổng tạm thời:{" "}
              <input
                className="flex-input-60"
                type="text"
                value={state.tempTotal}
                onChange={(e) =>
                  handleInputChange("SET_TEMP_TOTAL", e.target.value)
                }
              />
            </label>
            <label className=" flex flex-justify-between">
              Tổng thực tế:{" "}
              <input
                className="flex-input-60"
                type="text"
                value={state.actualTotal}
                onChange={(e) =>
                  handleInputChange("SET_ACTUAL_TOTAL", e.target.value)
                }
              />
            </label>
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
                    <option value="">Người đặt</option>
                    {data.map((name, idx) => (
                      <option key={idx} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Giá món ăn của {person.name || ""}:{" "}
                  <input
                    className="select-name "
                    type="text"
                    value={person.mealPrice}
                    onChange={(e) =>
                      handleMealPriceChange(index, e.target.value)
                    }
                  />
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
                  <th>Giá món ăn</th>
                  <th>Số tiền cần chi trả</th>
                </tr>
              </thead>
              <tbody>
                {state.result.map((res, index) => (
                  <tr key={index}>
                    <td>{res.name}</td>
                    <td>{formatNumber(res.mealPrice || 0)}</td>
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

export default BillGrab;
