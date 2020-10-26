import React, { useState, useEffect } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import { listLogEntries } from "./API";
import LogEntryForm from "./LogEntryForm";
import "./App.css";

const App = () => {
	const [logEntries, setLogEntries] = useState([]);
	const [showPopup, setShowPopup] = useState({});
	const [addEntryLocation, setAddEntryLocation] = useState(null);
	const [viewport, setViewport] = useState({
		width: "100vw",
		height: "100vh",
		latitude: 37.6,
		longitude: -95.665,
		zoom: 3,
	});
	
	const getEntries = async () => {
		const logEntries = await listLogEntries();
		setLogEntries(logEntries);
	}
	
	useEffect(() => {
		getEntries();
	}, []);
	
	const showAddMarkerPopup = (event) => {
		const [longitude, latitude] = event.lngLat;
		setAddEntryLocation({
			latitude,
			longitude,
		});
	};
	
	return (
		<ReactMapGL
		{...viewport}
		mapStyle="mapbox://styles/akashamar/ckgjf5za20zsj19thsg46pdrt"
		mapboxApiAccessToken="pk.eyJ1IjoiYWthc2hhbWFyIiwiYSI6ImNrZ2o5ZzFsZzB0ZGgzM3FuMHRibWdnaG8ifQ.CgFRsAiieTeNv2OKAWP04g"
		onViewportChange={setViewport}
		onDblClick={(event) => {showAddMarkerPopup(event);
			setShowPopup({});
		}}
		>
		{logEntries.map((entry) => (
			<div key={entry._id}>
			<Marker
			key={entry._id}
			latitude={entry.latitude}
			longitude={entry.longitude}
			offsetLeft={-20}
			offsetTop={-10}
			>
		<div
		onClick={() =>
			setShowPopup({
				[entry._id]: true,
			})
		}
		>
		<img
		className="locatedMarker"
		src="https://www.flaticon.com/svg/static/icons/svg/787/787535.svg"
		alt="Pin free icon"
		title="Pin free icon"
		/>
		</div>
		</Marker>
		{showPopup[entry._id] ? (
			<Popup
			className="popup"
			latitude={entry.latitude}
			longitude={entry.longitude}
			closeButton={true}
			closeOnClick={false}
			dynamicPosition={true}
			offsetLeft={-8}
			offsetTop={15}
			onClose={() => setShowPopup({})}
			anchor="top"
			>
			<div className="description">
			<h3>{entry.title}</h3>
			<p>{entry.comments}</p>
			<small>
			Visited on: {new Date(entry.visitDate).toLocaleDateString()}
			</small>
			{entry.image && <img src={entry.image} alt={entry.title} />}
			</div>
			</Popup>
		) : null}
		</div>
		))}
		{addEntryLocation ? (
			<>
			<Marker
			latitude={addEntryLocation.latitude}
			longitude={addEntryLocation.longitude}
			offsetLeft={-20}
			offsetTop={-10}
			>
			<div>
			<img
			width="25px"
			height="25px"
			src="https://www.flaticon.com/svg/static/icons/svg/1673/1673188.svg"
			alt="Pin free icon"
			title="Pin free icon"
			/>
			</div>
			</Marker>
			<Popup
			className="popup"
			latitude={addEntryLocation.latitude}
			longitude={addEntryLocation.longitude}
			closeButton={true}
			closeOnClick={false}
			offsetLeft={-8}
			offsetTop={15}
			onClose={() => setAddEntryLocation(null)}
			anchor="top"
			>
			<div>
			<LogEntryForm 
			onClose={() => { setAddEntryLocation(null);
				getEntries();
			}}
			location={addEntryLocation} 
			/>
			</div>
			</Popup>
			</>
		) : null}
		</ReactMapGL>
	);
};

export default App;
