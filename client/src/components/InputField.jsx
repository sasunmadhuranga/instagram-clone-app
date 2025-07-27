const InputField =({label, type, name, value, onChange}) =>(
    <div className="mb-4"> 
        <label className="block text-sm font-semibold mb-1">{label}</label>
        <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
    </div>
);
export default InputField;