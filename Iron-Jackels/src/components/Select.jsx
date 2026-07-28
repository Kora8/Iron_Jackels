import "./Select.css";

function Select({
    label,
    name,
    options,
    value,
    onChange
}) {

    return (

        <div className="mb-4">

            <label className="form-label text-light">
                {label}
            </label>

            <select
                className="form-select custom-select"
                name={name}
                value={value}
                onChange={onChange}
            >

                <option value="">
                    Seleccionar
                </option>

                {options.map((option) => (
                    <option
                        key={option.value}
                        value={option.value}
                    >
                        {option.label}
                    </option>
                ))}

            </select>

        </div>

    );

}

export default Select;