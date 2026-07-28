import "./Upload.css";

function Upload({ onChange }) {

    return (

        <div className="mb-4">

            <label className="form-label text-light">

                Insertar imagen, gif o video

            </label>

            <input
                className="form-control custom-input"
                type="file"
                accept="image/*,video/*,.gif"
                onChange={onChange}
            />

        </div>

    );

}

export default Upload;