import Image from "next/image";
import React, { useEffect, useState } from "react";

function BannersSection({ sectionNumber, banners, handleDelete }) {
    const [bannersList, setBannersList] = useState(banners);

    useEffect(() => {
        setBannersList(banners);
    }, [banners]);

    return (
        <div className="add-banner banner-list column">
            <h3>Banner Number {sectionNumber}</h3>
            <div className="banners ">
                {bannersList?.map((item, index) => {
                    return (
                        <div className="image-container" key={item.id}>
                            <span className="grad"></span>

                            <Image
                                alt="banner-img"
                                height={150}
                                width={300}
                                src={`https://dashcommerce.click68.com/${item?.banner}`}
                                key={index}
                                layout="fixed"
                            />
                            <div className="actions">
                                <div
                                    className="action center"
                                    onClick={() => handleDelete(item?.id)}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        fill="currentColor"
                                        className="bi bi-trash"
                                        viewBox="0 0 16 16"
                                    >
                                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                        <path
                                            fillRule="evenodd"
                                            d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default BannersSection;
