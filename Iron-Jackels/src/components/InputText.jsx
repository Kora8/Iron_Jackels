import "./InputText.css";

function InputText({ label, placeholder, value, onChange }) {

    return (

        <div className="mb-4">

            <label className="form-label text-light">

                {label}

            </label>

            <input
                className="form-control custom-input"
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />

        </div>

    );

}

export default InputText;