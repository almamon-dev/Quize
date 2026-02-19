import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const RichTextEditor = ({ value, onChange, placeholder, label, error }) => {
    const modules = {
        toolbar: [
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ color: [] }, { background: [] }],
            ["link", "blockquote", "code-block"],
            ["clean"],
        ],
    };

    const formats = [
        "header",
        "bold",
        "italic",
        "underline",
        "strike",
        "list",
        "bullet",
        "color",
        "background",
        "link",
        "blockquote",
        "code-block",
    ];

    return (
        <div className="space-y-2">
            {label && (
                <label className="block text-sm font-bold text-gray-700">
                    {label}
                </label>
            )}
            <div
                className={`rounded-xl overflow-hidden border ${error ? "border-red-500" : "border-gray-200"} bg-white shadow-sm`}
            >
                <ReactQuill
                    theme="snow"
                    value={value || ""}
                    onChange={onChange}
                    modules={modules}
                    formats={formats}
                    placeholder={placeholder}
                    className="prose max-w-none"
                />
            </div>
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}

            <style jsx global>{`
                .quill {
                    display: flex;
                    flex-direction: column;
                }
                .ql-toolbar.ql-snow {
                    border: none !important;
                    border-bottom: 1px solid #f3f4f6 !important;
                    background: #f9fafb;
                    padding: 12px !important;
                }
                .ql-container.ql-snow {
                    border: none !important;
                    min-height: 200px;
                    font-size: 15px;
                }
                .ql-editor {
                    padding: 20px !important;
                    min-height: 200px;
                }
                .ql-editor.ql-blank::before {
                    left: 20px !important;
                    color: #9ca3af !important;
                    font-style: normal !important;
                }
                .ql-snow .ql-stroke {
                    stroke: #64748b !important;
                }
                .ql-snow .ql-fill {
                    fill: #64748b !important;
                }
                .ql-snow .ql-picker {
                    color: #64748b !important;
                }
                .ql-snow.ql-toolbar button:hover,
                .ql-snow .ql-toolbar button:hover .ql-stroke,
                .ql-snow.ql-toolbar button.ql-active,
                .ql-snow .ql-toolbar button.ql-active .ql-stroke {
                    color: #2563eb !important;
                    stroke: #2563eb !important;
                }
            `}</style>
        </div>
    );
};

export default RichTextEditor;
