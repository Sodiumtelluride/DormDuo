import { use } from 'react';
import './UserProfile.css'
import { useState, useEffect } from 'react'
import Card from '../card/Card.jsx'
import PFPUpdater from '../PFPUpdater/PFPUpdater.jsx'
export default function UserProfile(props) {
    const [imageCount, setImageCount] = useState(0);
    const [data, setData] = useState({
        imageUrls: [],
        user_info: {} // Initialize user_info
    });
    const [roomate, setRoomate] = useState({});
    useEffect(() => {
        fetch('http://localhost:5174/getMe/me', {
            method: 'GET',
            credentials: 'include'
        })
        .then(response => response.json())
        .then(data => {
            setImageCount(data.imageUrls.length);
            console.log("urls", data.imageUrls);
            console.log('Fetched data:', data);
            setData(data);
        })
        .catch(error => console.error('Error fetching data:', error));
    }, []);

    useEffect(() => {
        if (!data.images) return;
        console.log("Images:", data.images);
        console.log("Data:", data);
        if (imageCount + data.images.length <= 5) {
            const newImageUrls = [];
            const readers = data.images.map(image => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    newImageUrls.push(reader.result);
                    if (newImageUrls.length === data.images.length) {
                        setData(prevData => ({
                            ...prevData,
                            imageUrls: [...prevData.imageUrls, ...newImageUrls],
                        }));
                        setImageCount(prevCount => prevCount + newImageUrls.length);
                        console.log(imageCount);
                    }
                };
                reader.readAsDataURL(image);
                return reader;
            });
        }
    }, [data.images]);

    useEffect(() => {
        if (!data.image) return;
        console.log("Image:", data.image);
        console.log("Data:", data);
        if (imageCount < 5) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setData(prevData => ({
                    ...prevData,
                    imageUrls: [...prevData.imageUrls, reader.result],
                //     image: null // Clear the image after adding to imageUrls
                }));
                setImageCount(prevCount => prevCount + 1);
                console.log(imageCount);
            };
            reader.readAsDataURL(data.image);
        }
    }, [data.image]);

     useEffect(() => {
        if(data.user_info.roommate && data.user_info.roommate.id) {
            fetch(`http://localhost:5174/user/${data.user_info.roommate.id}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
              .then(response => response.json())
              .then(data => {
                console.log('Fetched data:', data);
                setRoomate(data);
            })
              .catch(error => console.error('Error fetching data:', error));
        }
    }, [data]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "email" || name==="password") {
            setData(prevData => ({
                ...prevData,
                [name]: value
            }));
        } else if(name === "images") {
            setData(prevData => ({
                ...prevData,
                images: Array.from(files)
            }));
        } else {
            setData(prevData => ({
                ...prevData,
                user_info: {
                    ...prevData.user_info,
                    [name]: value // Update the specific field inside user_info
                }
            }));
    
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
//         console.log('Data:', data.images);
//         console.log('Data:', data.image);
        const formData = new FormData();
        Object.keys(data).forEach(key => {
            if (key === 'user_info') {
                Object.keys(data.user_info).forEach(subKey => {
                    formData.append(subKey, data.user_info[subKey]);
                });
            } else if (key === 'images') {
                data.images.forEach(image => {
                    formData.append('images', image);
                });
            } else {
                formData.append(key, data[key]);
            }
        });
//         console.log('Form data:', formData.entries().images);
//         console.log('Form data:', formData.entries().image);

        fetch('http://localhost:5174/userGet/updateMe', {
            method: 'POST',
            credentials: 'include',
            body: formData
        
        })
        .then(response => response.json())
        .then(result => {
            console.log('Profile updated successfully:', result);
        })
        .catch(error => {

            console.error('Error updating profile:', error);
        });
    };

    const handleDelete = async (imageUrl) => {
        try {
            const response = await fetch('http://localhost:5174/deleteImage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include', // Include credentials to send cookies
                body: JSON.stringify({ imageUrl })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Something went wrong');
            }

            const result = await response.json();
            console.log('Image deleted successfully');
            // Update state to remove the deleted image
            setData(prevData => ({
                ...prevData,
                imageUrls: prevData.imageUrls.filter(url => url !== imageUrl)
            }));
        } catch (err) {
            console.log(err);
        }
    };

    const deleteRoomate = async () => {
        try {
            const response = await fetch('http://localhost:5174/roommateRequest/delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include', // Include credentials to send cookies
                body: JSON.stringify({ id: data.user_id })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Something went wrong');
            }

            const result = await response.json();
            console.log('Roomate deleted successfully');
            // Update state to remove the deleted roomate
            setData(prevData => ({
                ...prevData,
                user_info: {
                    ...prevData.user_info,
                    roommate: {}
                }
            }));
        } catch (err) {
            console.log(err);
        }
    };
    
    return (
        <form onSubmit={handleSubmit} encType="multipart/form-data" className="user-profile">
            <div className="login-info">
                <div className="email field">
                    <h3 className="email heading">Email:</h3>
                    <textarea 
                        name="email"
                        value={data.email || ''} 
                        onChange={handleChange} 
                        className="email-text"
                    ></textarea>
                </div>
                <PFPUpdater isUserProfile={true}/>
                <div className="password field">
                    <h3 className="password heading">Password:</h3>
                    <textarea 
                        name="password"
                        value={data.password || ''} 
                        onChange={handleChange} 
                        className="password-text"
                    ></textarea>
                </div>
            </div>
    
            

            <div className="profile-info">
                <div className="column-one">
                    <div className="email field">
                        <h3 className="email heading">Email:</h3>
                        <textarea 
                            name="email"
                            value={data.email || ''} 
                            onChange={handleChange} 
                            className="email-text"
                        ></textarea>
                    </div>
                    <div className="password field">
                        <h3 className="password heading">Password:</h3>
                        <textarea 
                            name="password"
                            value={data.password || ''} 
                            onChange={handleChange} 
                            className="password-text"
                        ></textarea>
                    </div>
                    <div className="display-name field">
                        <h3 className="display-name heading">Display Name:</h3>
                        <textarea 
                            name="display_name"
                            value={data.user_info && data.user_info.display_name ? data.user_info.display_name : data.first_name + " " + data.last_name} 
                            onChange={handleChange} 
                            className="display-name-text"
                        ></textarea>
                    </div>
                    <div className="pronouns field">
                        <h3 className="pronouns heading">Pronouns:</h3>
                        <select 
                            name="pronouns"
                            value={data.user_info && data.user_info.pronouns ? data.user_info.pronouns : ''} 
                            onChange={handleChange} 
                            className="pronouns-dropdown"
                        >
                            <option value="">Select</option>
                            <option value="he/him">he/him</option>
                            <option value="she/her">she/her</option>
                            <option value="they/them">they/them</option>
                            <option value="Prefer Not to Specify">Prefer Not to Specify</option>
                        </select>
                    </div>
                    <div className="major field">
                        <h3 className="major heading">Major:</h3>
                        <select 
                            name="major"
                            value={data.user_info && data.user_info.major ? data.user_info.major : ''} 
                            onChange={handleChange} 
                            className="major-dropdown"
                        >
                            <option value="">Select</option>
                            <option value="Accounting">Accounting</option>
                            <option value="Afro-American Studies">Afro-American Studies</option>
                            <option value="Animal Science">Animal Science</option>
                            <option value="Anthropology">Anthropology</option>
                            <option value="Arboriculture and Community Forest Management">Arboriculture and Community Forest Management</option>
                            <option value="Architecture">Architecture</option>
                            <option value="Art">Art</option>
                            <option value="Art Education">Art Education</option>
                            <option value="Art History">Art History</option>
                            <option value="Astronomy">Astronomy</option>
                            <option value="Bachelor’s Degree with Individual Concentration (BDIC)">Bachelor’s Degree with Individual Concentration (BDIC)</option>
                            <option value="Biochemistry and Molecular Biology">Biochemistry and Molecular Biology</option>
                            <option value="Biology">Biology</option>
                            <option value="Biomedical Engineering">Biomedical Engineering</option>
                            <option value="Building and Construction Technology">Building and Construction Technology</option>
                            <option value="Chemical Engineering">Chemical Engineering</option>
                            <option value="Chemistry">Chemistry</option>
                            <option value="Chinese Language and Literature">Chinese Language and Literature</option>
                            <option value="Civil Engineering">Civil Engineering</option>
                            <option value="Classics">Classics</option>
                            <option value="Communication">Communication</option>
                            <option value="Comparative Literature">Comparative Literature</option>
                            <option value="Computer Science">Computer Science</option>
                            <option value="Dance">Dance</option>
                            <option value="Earth Systems">Earth Systems</option>
                            <option value="Economics">Economics</option>
                            <option value="Education">Education</option>
                            <option value="Electrical and Computer Engineering">Electrical and Computer Engineering</option>
                            <option value="English">English</option>
                            <option value="Environmental Engineering">Environmental Engineering</option>
                            <option value="Environmental Science">Environmental Science</option>
                            <option value="Film Studies">Film Studies</option>
                            <option value="Film Studies through BDIC">Film Studies through BDIC</option>
                            <option value="Finance">Finance</option>
                            <option value="Food Science">Food Science</option>
                            <option value="French & Francophone Studies">French & Francophone Studies</option>
                            <option value="Geography">Geography</option>
                            <option value="Geology">Geology</option>
                            <option value="Geosciences">Geosciences</option>
                            <option value="German and Scandinavian Studies">German and Scandinavian Studies</option>
                            <option value="History">History</option>
                            <option value="History of Art and Architecture">History of Art and Architecture</option>
                            <option value="Horticultural Science">Horticultural Science</option>
                            <option value="Hospitality and Tourism Management">Hospitality and Tourism Management</option>
                            <option value="Industrial Engineering">Industrial Engineering</option>
                            <option value="Informatics">Informatics</option>
                            <option value="Italian Studies">Italian Studies</option>
                            <option value="Japanese Language & Literature">Japanese Language & Literature</option>
                            <option value="Journalism">Journalism</option>
                            <option value="Judaic Studies">Judaic Studies</option>
                            <option value="Kinesiology">Kinesiology</option>
                            <option value="Landscape Architecture">Landscape Architecture</option>
                            <option value="Landscape Contracting">Landscape Contracting</option>
                            <option value="Legal Studies">Legal Studies</option>
                            <option value="Linguistics">Linguistics</option>
                            <option value="Management">Management</option>
                            <option value="Managerial Economics">Managerial Economics</option>
                            <option value="Marketing">Marketing</option>
                            <option value="Mathematics">Mathematics</option>
                            <option value="Mechanical Engineering">Mechanical Engineering</option>
                            <option value="Microbiology">Microbiology</option>
                            <option value="Middle Eastern Studies">Middle Eastern Studies</option>
                            <option value="Music">Music</option>
                            <option value="Natural Resources Conservation">Natural Resources Conservation</option>
                            <option value="Nursing">Nursing</option>
                            <option value="Nutrition">Nutrition</option>
                            <option value="Operations and Information Management">Operations and Information Management</option>
                            <option value="Philosophy">Philosophy</option>
                            <option value="Physics">Physics</option>
                            <option value="Plant and Soil Science">Plant and Soil Science</option>
                            <option value="Political Science">Political Science</option>
                            <option value="Portuguese">Portuguese</option>
                            <option value="Pre-Medical, Pre-Health">Pre-Medical, Pre-Health</option>
                            <option value="Pre-Veterinary Science">Pre-Veterinary Science</option>
                            <option value="Psychology">Psychology</option>
                            <option value="Public Health Sciences">Public Health Sciences</option>
                            <option value="Public Policy">Public Policy</option>
                            <option value="Resource Economics">Resource Economics</option>
                            <option value="Russian and East European Studies">Russian and East European Studies</option>
                            <option value="Social Thought and Political Economy">Social Thought and Political Economy</option>
                            <option value="Sociology">Sociology</option>
                            <option value="Spanish">Spanish</option>
                            <option value="Speech, Language, and Hearing Sciences">Speech, Language, and Hearing Sciences</option>
                            <option value="Sport Management">Sport Management</option>
                            <option value="Sustainable Community Development">Sustainable Community Development</option>
                            <option value="Sustainable Food and Farming">Sustainable Food and Farming</option>
                            <option value="Sustainable Horticulture">Sustainable Horticulture</option>
                            <option value="Theater">Theater</option>
                            <option value="Turfgrass Management">Turfgrass Management</option>
                            <option value="University Without Walls Interdisciplinary Studies">University Without Walls Interdisciplinary Studies</option>
                            <option value="Veterinary Technology">Veterinary Technology</option>
                            <option value="Women, Gender, Sexuality Studies">Women, Gender, Sexuality Studies</option>
                        </select>
                    </div>
                    <div className="grad field">
                        <h3 className="grad heading">Class:</h3>
                        <select 
                            name="grad"
                            value={data.user_info && data.user_info.grad ? data.user_info.grad : ''} 
                            onChange={handleChange} 
                            className="grad-dropdown"
                        >
                            <option value="">Select</option>
                            <option value="2025">2025</option>
                            <option value="2026">2026</option>
                            <option value="2027">2027</option>
                            <option value="2028">2028</option>
                            <option value="2029">2029</option>
                            <option value="2030">2030</option>
                        </select>
                    </div>
                    <div className="origin field">
                        <h3 className="origin heading">Origin:</h3>
                        <select 
                            name="place_origin"
                            value={data.user_info && data.user_info.place_origin ? data.user_info.place_origin : ''} 
                            onChange={handleChange} 
                            className="origin-dropdown"
                        >
                            <option value="">Select</option>
                            <option value="In-State">In-State</option>
                            <option value="Out-Of-State">Out-Of-State</option>
                        </select>
                    </div>
                    <div className="description field">
                        <h3 className="description heading">Description:</h3>
                        <textarea 
                            name="description"
                            value={data.user_info && data.user_info.description ? data.user_info.description : ''} 
                            onChange={handleChange} 
                            className="description-text"
                        ></textarea>
                    </div>
                </div>
                <div className="column-two">
                    
                    <div className="extraversion field">
                        <h3 className="extraversion heading">Extraversion:</h3>
                        <select  
                            name="extraversion"
                            value={data.user_info && data.user_info.extraversion ? data.user_info.extraversion : ''} 
                            onChange={handleChange}
                            id="extraversion" className="extraversion-dropdown" 
                        >
                            <option value="select">Select</option>
                            <option value="none">None</option>
                            <option value="low">Low</option>
                            <option value="average">Average</option>
                            <option value="above-average">Above Average</option>
                            <option value="high">High</option>
                        </select>
                    </div>
                    <div className="cleanliness field">
                        <h3 className="cleanliness heading">Cleanliness:</h3>
                        <select 
                            name="cleanliness"
                            value={data.user_info && data.user_info.cleanliness ? data.user_info.cleanliness : ''} 
                            onChange={handleChange}
                            id="cleanliness" className="cleanliness-dropdown" 
                        >
                            <option value="select">Select</option>
                            <option value="none">None</option>
                            <option value="low">Low</option>
                            <option value="average">Average</option>
                            <option value="above-average">Above Average</option>
                            <option value="high">High</option>
                        </select>
                    </div>
                    <div className="using-my-stuff field">
                        <h3 className="using-my-stuff heading">Using My Stuff:</h3>
                        <select 
                            name="using_my_stuff"
                            value={data.user_info && data.user_info.using_my_stuff ? data.user_info.using_my_stuff : ''} 
                            onChange={handleChange}
                            id="using-my-stuff" className="using-my-stuff-dropdown" 
                        >
                            <option value="">Select</option>
                            <option value="Not Allowed">Not Allowed</option>
                            <option value="Allowed If You Ask">Allowed If You Ask</option>
                            <option value="Always Allowed">Always Allowed</option>
                        </select>
                    </div>
                    <div className="bedtime field"> 
                        <h3 className="bedtime heading">Bedtime:</h3>
                        <select 
                            name="start_time"
                            value={data.user_info && data.user_info.start_time ? data.user_info.start_time : '12:00 AM'} 
                            onChange={handleChange}
                            id="start-time" className="start-time-dropdown" 
                        >
                            <option value="12:00 AM">12:00 AM</option>
                            <option value="1:00 AM">1:00 AM</option>
                            <option value="2:00 AM">2:00 AM</option>
                            <option value="3:00 AM">3:00 AM</option>
                            <option value="4:00 AM">4:00 AM</option>
                            <option value="5:00 AM">5:00 AM</option>
                            <option value="6:00 AM">6:00 AM</option>
                            <option value="7:00 AM">7:00 AM</option>
                            <option value="8:00 AM">8:00 AM</option>
                            <option value="9:00 AM">9:00 AM</option>
                            <option value="10:00 AM">10:00 AM</option>
                            <option value="11:00 AM">11:00 AM</option>
                            <option value="12:00 PM">12:00 PM</option>
                            <option value="1:00 PM">1:00 PM</option>
                            <option value="2:00 PM">2:00 PM</option>
                            <option value="3:00 PM">3:00 PM</option>
                            <option value="4:00 PM">4:00 PM</option>
                            <option value="5:00 PM">5:00 PM</option>
                            <option value="6:00 PM">6:00 PM</option>
                            <option value="7:00 PM">7:00 PM</option>
                            <option value="8:00 PM">8:00 PM</option>
                            <option value="9:00 PM">9:00 PM</option>
                            <option value="10:00 PM">10:00 PM</option>
                            <option value="11:00 PM">11:00 PM</option>
                        </select>
                        <h4>-</h4>
                        <select 
                            name="end_time"
                            value={data.user_info && data.user_info.end_time ? data.user_info.end_time : '12:00 AM'} 
                            onChange={handleChange}
                            id="end-time" className="end-time-dropdown" 
                        >
                            <option value="12:00 AM">12:00 AM</option>
                            <option value="1:00 AM">1:00 AM</option>
                            <option value="2:00 AM">2:00 AM</option>
                            <option value="3:00 AM">3:00 AM</option>
                            <option value="4:00 AM">4:00 AM</option>
                            <option value="5:00 AM">5:00 AM</option>
                            <option value="6:00 AM">6:00 AM</option>
                            <option value="7:00 AM">7:00 AM</option>
                            <option value="8:00 AM">8:00 AM</option>
                            <option value="9:00 AM">9:00 AM</option>
                            <option value="10:00 AM">10:00 AM</option>
                            <option value="11:00 AM">11:00 AM</option>
                            <option value="12:00 PM">12:00 PM</option>
                            <option value="1:00 PM">1:00 PM</option>
                            <option value="2:00 PM">2:00 PM</option>
                            <option value="3:00 PM">3:00 PM</option>
                            <option value="4:00 PM">4:00 PM</option>
                            <option value="5:00 PM">5:00 PM</option>
                            <option value="6:00 PM">6:00 PM</option>
                            <option value="7:00 PM">7:00 PM</option>
                            <option value="8:00 PM">8:00 PM</option>
                            <option value="9:00 PM">9:00 PM</option>
                            <option value="10:00 PM">10:00 PM</option>
                            <option value="11:00 PM">11:00 PM</option>
                        </select>
                    </div>
                    <div className="picture-upload field">
                        <h3 className="picture-upload heading">Add Image:</h3>
                        <input type="file" name="images" accept="image/*" className="picture-upload-input" onChange={handleChange} multiple/>
                    </div>
                    
                    <div className='images field'>
                        <h3 className='image heading'>Images:</h3>
                        <div className="images-container">
                            {data.imageUrls.map((url, index) => (
                                <div className="image" key={index}>
                                    {url !== null && 
                                        <div>
                                            <img src={url} alt="" />
                                            <button className="delete-button" type="button" onClick={() => handleDelete(url)}>Delete</button>
                                        </div>    
                                        }

                                </div>
                            ))}
                        </div>
                    </div>
                    <div className='images field'>
                        <h3 className='image heading'>Images:</h3>
                        <div className="images-container">
                            {data.imageUrls.map((url, index) => (
                                <div className="image" key={index}>
                                    {url !== null && 
                                        <div>
                                            <img src={url} alt="" />
                                            <button className="delete-button" type="button" onClick={() => handleDelete(url)}>Delete</button>
                                        </div>    
                                        }
    
                                </div>
                            ))}
                        </div>
                    </div>
                    <button type='submit' className="update-button">Update</button>
                    <button className="delete-button">Delete Your Account</button>
                </div>
                {(data.user_info.roommate && data.user_info.roommate.id) &&
                <div className="roomate">
                    <h1 className='roomate-title'>Roomate</h1>
                    <Card
                        key={1}
                        img={roomate.img}
                        name={roomate.user_info && roomate.user_info.display_name ? roomate.user_info.display_name : roomate.first_name + " " + roomate.last_name}
                        pronouns={roomate.user_info ? roomate.user_info.pronouns : null}
                        description={roomate.user_info ? roomate.user_info.description : null}
                        major={roomate.user_info ? roomate.user_info.major : null}
                        class={roomate.user_info ? roomate.user_info.grad : null}
                        
                    />
                    <button className='delete-button' onClick={deleteRoomate}>Cancel Roomate</button>
                </div>
                }
            </div>
        </form>
    );
}