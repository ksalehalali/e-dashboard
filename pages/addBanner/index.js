import BannersSection from "@/components/addBanners/BannersSection";
import Main from "@/components/layout/main";
import { Button, message, Modal, Progress } from "antd";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { useCookies } from "react-cookie";
import useFetch from "utils/useFetch";

function AddBanner() {
    const imageRef = useRef();
    const numRef = useRef();
    const [imageName, setImageName] = useState();
    const [cookies, setCookies, clearCookies] = useCookies(["user"]);
    const [banners, setBanners] = useState([]);
    const [banners2, setBanners2] = useState([]);
    const [banners3, setBanners3] = useState([]);
    const [progressNum, setProgressNum] = useState(0);

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
        data: data2 = [],
        error: error2,
        loading: loading2,
        executeFetch: executeFetch2,
    } = useFetch(
        "https://dashcommerce.click68.com/api/ListBanner2",
        "get",
        {},
        true
    );
    const {
        data: data3 = [],
        error: error3,
        loading: loading3,
        executeFetch: executeFetch3,
    } = useFetch(
        "https://dashcommerce.click68.com/api/ListBanner3",
        "get",
        {},
        true
    );
    // Set each banners list
    useEffect(() => {
        setBanners(data?.description);
    }, [data, error, loading]);
    useEffect(() => {
        setBanners2(data2?.description);
    }, [data2, error2, loading2]);
    useEffect(() => {
        setBanners3(data3?.description);
    }, [data3, error3, loading3]);

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

    const handleImage = (e) => {
        e.preventDefault();
        setImageName(e.target.files[0]);
        setTimeout(() => {
            setProgressNum(100);
        }, 400);
    };
    const handleAddBanner = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("Banner", imageName);
        formData.append("BannerNumber", numRef.current.value);
        if (numRef.current.value === "1") {
            if (data2?.description.length === 0) {
                addExecuteFetch(formData, true);
            } else message.error("Only one allowed!");
        } else addExecuteFetch(formData, true);
    };
    useEffect(() => {
        if (addData?.status === true) {
            message.success("Banner has been added.");
            executeFetch();
            executeFetch2();
            executeFetch3();
            setProgressNum(0);
        } else if (addData?.status === false) {
            message.error(
                addError ?? "Something went wrong! Please try again later"
            );
        }
    }, [addData, addError, addLoading]);

    // Hnadle delete function
    const handleDelete = async (id) => {
        Modal.confirm({
            title: "Are you sure you want delete this banner",
            onOk() {
                deleteAction();
            },
        });

        const deleteAction = async () => {
            await axios
                .post(
                    `${process.env.NEXT_PUBLIC_HOST_API}api/DeleteBanner`,
                    {
                        id: id,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${cookies?.user.token}`,
                        },
                    }
                )
                .then((res) => {
                    if (res?.data.status) {
                        message.success("Banner has added");
                        executeFetch();
                        executeFetch2();
                        executeFetch3();
                    }
                })
                .catch((err) => {
                    console.error(err);
                    message.error("Sorry, something went wrong");
                });
        };
    };

    return (
        <Main>
            <div className="banner__container">
                <div className="add-banner banner">
                    <div className="add">
                        <h2>Add banner</h2>
                        <h4>File Upload Here</h4>
                        <div className="input-container column">
                            <form method="post" onSubmit={handleAddBanner}>
                                <label htmlFor="input-file" className="column">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        fill="currentColor"
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
                                        accept="image/png, image/jpeg"
                                        ref={imageRef}
                                    />
                                    <span>
                                        {/* Image name: <strong>{imageName}</strong> */}
                                    </span>
                                </label>
                                <Progress
                                    type="circle"
                                    percent={progressNum}
                                    format={() => "Done"}
                                />
                                <p>add number for banner</p>
                                <select name="BannerNumber" ref={numRef}>
                                    <option value={"0"}>1</option>
                                    <option value={"1"}>2</option>
                                    <option value={"2"}>3</option>
                                </select>
                                <br />
                                <input type={"submit"} name={"submit"} />
                            </form>
                        </div>
                    </div>
                </div>

                <BannersSection
                    sectionNumber="1"
                    banners={banners}
                    handleDelete={handleDelete}
                />
                <BannersSection
                    sectionNumber="2"
                    banners={banners2}
                    handleDelete={handleDelete}
                />
                <BannersSection
                    sectionNumber="3"
                    banners={banners3}
                    handleDelete={handleDelete}
                />
            </div>
        </Main>
    );
}

export default AddBanner;
