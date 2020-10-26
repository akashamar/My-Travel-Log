import React, {useState, useRef} from "react";
import "./LogEntryForm.css";
import { useForm } from "react-hook-form";
import { createLogEntry } from "./API";

const LogEntryForm = ({ location, onClose }) => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);
	const { register, handleSubmit } = useForm();
	const addStyle = useRef(null);
	
	const onSubmit = async (data) => {
		try {
		    setLoading(true);
			data.latitude = location.latitude;
			data.longitude = location.longitude;
			const created = await createLogEntry(data);
			console.log("craeted entries=", created);
			onClose();
			} catch (error) {
			console.error(error);
			setError(error.message);
		}
		console.log("entered data", data);
		register(false)
	};
	
	
	const change = (event) => {
	    const img = event.target.value;
		const Regx = /(http)?s?:?(\/\/[^"']*\.(?:png|jpg|jpeg|gif|png|svg))/;
		
		if(Regx.test(img)){
			console.log('done')
			addStyle.current.style.display="none";
		    onSubmit(handleSubmit(onSubmit)) ;
		    setLoading(false);
		}else{
			addStyle.current.style.display="flex";
			onSubmit(false);
		}
	}
    
	
	return (
		<form onSubmit={handleSubmit(onSubmit)} >
	    {error ? <h3 className="error">{error}</h3> : null}
		<label htmlFor="apiKey">API KEY</label><br/>
		<input type="password" name="apiKey" required ref={register} /><br/>
		<label htmlFor="title">Title</label><br/>
		<input name="title" required ref={register} /><br/>
		<label htmlFor="comments">Comments</label><br/>
		<input name="comments" required ref={register} /><br/>
		<label htmlFor="visitDate">Visit Date</label><br/>
		<input name="visitDate" type="date" required ref={register} /><br/>
		<label htmlFor="image" required ref={register}>Image Url</label><br/>
	    <input name="image"  onChange={change}  ref={register}/><br/>
	    <h3 ref={addStyle} className='Invalid' >Invalid Url</h3>
		<button disabled={loading}>{loading ? 'Loading...' : 'Create Entry'}</button>
		</form>
	);
};

export default LogEntryForm;
