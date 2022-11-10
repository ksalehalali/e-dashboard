import Main from "@/components/layout/main";
import { Button, message } from "antd";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { useCookies } from "react-cookie";
import useFetch from "utils/useFetch";

function AddBanner() {
    const imageRef=useRef();
    const numRef=useRef();
    const [imageName, setImageName] = useState();
    const [cookies, setCookies, clearCookies] = useCookies(["user"]);
    const [banners, setBanners] = useState([]);
    let formData = new FormData();
    // useEffect(async () => {
    //     await axios
    //         .get(process.env.NEXT_PUBLIC_HOST_API + "api/ListBanner1", {})
    //         .then((response) => {
    //             if (response.data.description.length > 0) {
    //                 console.log("bann", response.data.description);
    //                 setBanners(response.data.description);
    //             }
    //         })
    //         .catch((err) => console.error(err));
    // }, []);

    const {
        data = [],
        error,
        loading,
        executeFetch,
      } = useFetch(
        "https://dashcommerce.click68.com/api/ListBanner1",
        "get",
        {},
        true
      );

    const {
        data: addData = {},
        error: addError,
        loading: addLoading,
        executeFetch: addExecuteFetch,
    } = useFetch(
        `${process.env.NEXT_PUBLIC_HOST_API}api/AddBanner`,
        "post",
        {},
        false
    );

    useEffect( () => {
        
    setBanners(data?.description);
                
            
    }, [data,error,loading]);
const onFileChange=(e)=>{
console.log(e.target.files[0]);
if(e.target && e.target.files[0]){
    formData.append('file',e.target.files[0]);
}
};
const handleImage=(e)=>{
   e.preventDefault();
   console.log("imageeeeeee")
   console.log(e.target.files[0])
   setImageName(e.target.files[0])


};
    const handleAddBanner =  (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("Banner",imageName);
        formData.append("BannerNumber", numRef.current.value);
      //  formData.append("Banner", "/imageName/jpg");
      //  formData.append("BannerNumber", 0);
     
      addExecuteFetch(formData, true);
    };
    useEffect(() => {
        if (addData?.status === true) {
            message.success("Banner has been added.");
            executeFetch();
        } else if (addData?.status === false) {
            message.error(
                addError ?? "Something went wrong! Please try again later"
            );
        }
    }, [addData, addError, addLoading]);

   
    return (
        <Main>
            <div className="banner__container">
                <div className="add-banner banner">
                    <div className="add">
                        <h2>Add banner</h2>
                        <h4>File Upload Here</h4>
                        <div className="input-container">
                            <form method="post"  onSubmit={handleAddBanner}>

                            <label for="input-file">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    class="bi bi-upload"
                                    viewBox="0 0 16 16"
                                >
                                    <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
                                    <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z" />
                                </svg>
                                <input
                             //   onChange={onFileChange}
                               name="banner"
                               onChange={handleImage}
                                    type="file"
                                    className="upload"
                                    id="input-file"
                                    accept= "image/png, image/jpeg"
                                ref={imageRef}
                                />
                                <span>
                                    {/* Image name: <strong>{imageName}</strong> */}
                                </span>
                            </label>
                            <label>add number for banner</label>
                            <input   type={"text"}    ref={numRef} name="BannerNumber" />
                          <br/>
                            <input   type={"submit"}  name={"submit"}/>
                              
                            </form>
                        </div>
                    </div>
                </div>

                <div className="add-banner banner-list">
                    {banners?.map((item, index) => {
                        return (
                            <Image
                                height={100}
                                width={100}
                            
                                src={`https://dashcommerce.click68.com/${item.banner}`}
                                key={index}
                                layout="fixed"
                            />
                        );
                    })}
                </div>
            </div>
        </Main>
    );
}

export default AddBanner;
