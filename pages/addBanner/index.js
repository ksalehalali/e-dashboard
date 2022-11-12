import Main from "@/components/layout/main";
import { Button, message } from "antd";
import axios from "axios";
import Image from "next/image";
import React, { useCallback, useEffect } from "react";
import { useState } from "react";
import { useCookies } from "react-cookie";
import useFetch from "utils/useFetch";

function AddBanner() {
    const [imageName, setImageName] = useState("");
    const [cookies, setCookies, clearCookies] = useCookies(["user"]);
    const [banners, setBanners] = useState([]);
    const [response, setResponse] = useState("");
    const [, updateState] = useState();

    useEffect(() => {
        getDataList();
    }, []);

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
    const {
        data: editData = {},
        error: editError,
        loading: editLoading,
        executeFetch: editExecuteFetch,
    } = useFetch(
        `${process.env.NEXT_PUBLIC_HOST_API}api/EditBanner`,
        "post",
        {},
        false
    );

    const handleAddBanner = async () => {
        let formData = new FormData();
        formData.append("Banner", "/imageName/jpg");
        formData.append("BannerNumber", 0);
        addExecuteFetch(formData, true);
    };

    const handleEditBanner = (id) => {
        console.log(id);
        let formData = new FormData();
        formData.append("Banner", "05-min-1-1024x683.jpg");
        formData.append("BannerNumber", 0);
        formData.append("id", id);
        editExecuteFetch(formData, true);
    };

    console.log(editData);
    // Handle delete banner
    const handleDelete = async (id) => {
        console.log(id);
        await axios
            .post(
                `${process.env.NEXT_PUBLIC_HOST_API}api/Deletebanner`,
                {
                    id: id,
                },
                {
                    headers: {
                        Authorization: `Bearer ${cookies?.user?.token}`,
                    },
                }
            )
            .then((res) => {
                success("The banner is deleted!");
                getDataList();
                console.log(res.data);
            })
            .catch((err) => console.error(err));
    };

    const getDataList = async () => {
        await axios
            .get(process.env.NEXT_PUBLIC_HOST_API + "api/ListBanner1", {})
            .then((response) => {
                if (response.data.description.length > 0) {
                    console.log("bann", response.data.description);
                    setBanners(response.data.description);
                }
            })
            .catch((err) => console.error(err));
    };

    const success = (_message) => {
        message.success(_message);
    };
    return (
        <Main>
            <div className="banner__container">
                <div className="add-banner ">
                    <div className="add">
                        <h2>Add banner</h2>
                        <h4>File Upload Here</h4>
                        <div className="input-container">
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
                                    onChange={(e) => {
                                        console.log(e?.target?.files[0]);
                                        setImageName(e?.target?.files[0].name);
                                    }}
                                    type="file"
                                    className="upload"
                                    id="input-file"
                                />
                                <span>
                                    Image name: <strong>{imageName}</strong>
                                </span>
                            </label>
                            <Button onClick={handleAddBanner} className="">
                                Add Banner
                            </Button>
                        </div>
                    </div>
                </div>

                <h2>Previus banners</h2>
                <div className="add-banner banner-list">
                    {banners?.map((item, index) => {
                        return (
                            <div className="image-container">
                                <span className="grad"></span>
                                <Image
                                    height={150}
                                    width={300}
                                    src={`https://dashcommerce.click68.com/${item?.banner}`}
                                    key={index}
                                    layout="fixed"
                                />
                                <div className="actions">
                                    <div
                                        className="action"
                                        onClick={() => handleDelete(item?.id)}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            fill="currentColor"
                                            class="bi bi-trash"
                                            viewBox="0 0 16 16"
                                        >
                                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                            <path
                                                fill-rule="evenodd"
                                                d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
                                            />
                                        </svg>
                                    </div>
                                    <div
                                        className="action"
                                        onClick={() =>
                                            handleEditBanner(item?.id)
                                        }
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            fill="currentColor"
                                            class="bi bi-pencil-square"
                                            viewBox="0 0 16 16"
                                        >
                                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                            <path
                                                fill-rule="evenodd"
                                                d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </Main>
    );
}

export default AddBanner;
