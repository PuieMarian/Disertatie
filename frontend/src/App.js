import { useEffect, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { render } from 'react-dom';
import Map, { Marker, Popup, GeolocateControl, FullscreenControl, ScaleControl, NavigationControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { LocalParking, Star } from '@material-ui/icons';
import './app.css';
import { axiosInstance } from '../src/config';
import { format } from 'timeago.js';
import Register from './components/Register';
import Login from "./components/Login";
// import mapboxgl from '!mapbox-gl';


// mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;

const MAPBOX_TOKEN = 'pk.eyJ1IjoibWFyaWFuOTgiLCJhIjoiY2t6dHFjZ2ptMHp2YzJubW94ZHV5YzV1OSJ9.LeKKq-CuWqT3zBp-Jna1MA';


function App() {
    const myStorage = window.localStorage;
    const [currentUser, setCurrentUser] = useState(myStorage.getItem("user"));
    const [pins, setPins] = useState([]);
    const [currentPlaceId, setCurrentPlaceId] = useState(null);
    const [newPlace, setNewPlace] = useState(null);
    const [title, setTitle] = useState(null);
    const [desc, setDesc] = useState(null);
    const [rating, setRating] = useState(0);
    const [viewport, setViewport] = useState(0);
    const [showRegister, setShowRegister] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    useEffect(() => {
        const getPins = async () => {
            try {
                const res = await axiosInstance.get("/pins");
                setPins(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        getPins();

    }, []);

    const handleMarkerClick = (id, lat, long) => {
        setCurrentPlaceId(id);
        setViewport({ ...viewport, latitude: lat, longitude: long });
    };

    const handleAddClick = async (e) => {
        const { lat, lng: long } = e.lngLat;
        setNewPlace({ lat, long });
        const newPin = ({
            username: currentUser,
            title,
            desc,
            rating,
            lat: newPlace.lat,
            long: newPlace.long,
        });

        try {
            const res = await axiosInstance.post("/pins", newPin);
            setPins([...pins, res.data]);
            setNewPlace(null);
        } catch (err) {
            console.log(err);

        }
    };


    const handleSubmit = (e) => {
        e.preventDefault();
    }

    const handleLogout = () => {
        setCurrentUser(null);
        myStorage.removeItem("user");
    };


    return (
        <Map
            initialViewState={{
                latitude: 47.05515527806013,
                longitude: 21.928511112195537,
                zoom: 14
            }}

            {...viewport}
            style={{ width: '100vw', height: '100vh' }}
            mapStyle="mapbox://styles/marian98/cl03tr0t0000v14pcaxx6wvx2"
            mapboxAccessToken={MAPBOX_TOKEN}
            onViewportChange={(viewport) => setViewport(viewport)}
            onDblClick={handleAddClick}
            transitionDuration="200"
        >
            {pins.map(p => (
                <>

                    <Marker
                        longitude={p.long}
                        latitude={p.lat}
                        anchor="bottom"
                    >
                        <LocalParking style={{
                            color: p.username === currentUser ? "#ff3377" : "#8080ff",
                            cursor: "pointer", width: "20px", height: "20px"
                        }}
                            onClick={() => handleMarkerClick(p._id, p.lat, p.long)}
                        />
                    </Marker>
                    {p._id === currentPlaceId && (
                        <Popup
                            longitude={p.long}
                            latitude={p.lat}
                            anchor="left"
                        //  onClose={()=>setCurrentPlaceId(null)}
                        >
                            <div className="card">
                                <label>Locul</label>
                                <h4 className="place">{p.title}</h4>
                                <label>Revizuire</label>
                                <p className="desc">{p.desc}</p>
                                <label>Cotare</label>
                                <div className="stars">
                                    {Array(p.rating).fill(<Star className="star" />)}
                                </div>
                                <label>Informații</label>
                                <span className="username">Creat de <b>{p.username}</b></span>
                                <span className="date">{format(p.createdAt)}</span>
                            </div>
                        </Popup>
                    )}
                </>
            ))}
            {newPlace && (
                <Popup
                    longitude={newPlace.long}
                    latitude={newPlace.lat}
                    anchor="left"
                // onClose={()=>setNewPlace(null)}
                >
                    <div>
                        <form onSubmit={handleSubmit}>
                            <label>Titlu</label>
                            <input placelolder="Introduce titlul"
                                onChange={(e) => setTitle(e.target.value)}
                            />
                            <label>Revizuire</label>
                            <textarea placeholder="Spune ceva despre acest loc."
                                onChange={(e) => setDesc(e.target.value)}
                            />
                            <label>Cotare</label>
                            <select onChange={(e) => setRating(e.target.value)}>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                            </select>
                            <button className="submitButton" type="submit">Adăugare Pin</button>
                        </form>
                    </div>

                </Popup>
            )}
            {currentUser ? (<button className="button logout" onClick={handleLogout}>Deconectare</button>)
                :
                (
                    <div className="butons">
                        <button className="button login" onClick={() => setShowLogin(true)} >Autentificare</button>
                        <button className="button register" onClick={() => setShowRegister(true)}>Înregistrare</button>
                    </div>
                )}

            {showRegister && <Register setShowRegister={setShowRegister} />}
            {showLogin && (
                <Login
                    setShowLogin={setShowLogin}
                    setCurrentUser={setCurrentUser}
                    myStorage={myStorage}
                />
            )}

            <GeolocateControl className="location" />
            <FullscreenControl className="full" />
            <ScaleControl className="scale" />
            <NavigationControl className="navigation" />
        </Map>
    );
}

// render(<App />, document.body.appendChild(document.createElement('div')));

export default App;
