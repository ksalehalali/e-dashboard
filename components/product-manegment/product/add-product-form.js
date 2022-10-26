import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import React from "react";
import { drawerType_AddImageToProperty } from "@/redux/drawer/constants";
import { openDrawer } from "@/redux/drawer/action";
import { IoMdImages } from "react-icons/io";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";
// components
import {
    Form,
    Alert,
    Row,
    Col,
    Modal,
    Space,
    Input,
    Upload,
    Button,
    message,
    Select,
    Divider,
    Tooltip,
    Dropdown,
    Menu,
    AutoComplete,
} from "antd";
import UploadFileComponent from "../../../components/upload-file/upload-file";
import Main from "../../../components/layout/main";

// hooks
import useFetch from "../../../utils/useFetch";
// redux
import { useDispatch, useSelector } from "react-redux";
// styles
import style from "./style.module.css";

import {
    DeleteFilled,
    CameraOutlined,
    EditOutlined,
    DownOutlined,
    DeleteOutlined,
    PlusOutlined,
} from "@ant-design/icons";
import { withCookies } from "react-cookie";

function AddProduct({ allCookies, ...rest }) {
    const router = useRouter();
    const { id, name, image } = router.query;

    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const [selectedModel, setSelectedModel] = useState("");
    const [isValid, setIsValid] = useState(true);
    const [showActions, setShowActions] = useState(false);

    const [newImage, setNewImage] = useState({
        prev: null,
        file: null,
        validate: false,
    });
    const [imageFile, setImageFile] = useState({
        prev: null,
        file: null,
        validate: false,
    });
    const [img, setImg] = useState(null);
    const [value, setValue] = useState("");
    const [valueAr, setValueAr] = useState("");
    const [newId, setNewId] = useState("");
    console.log("id");
    console.log(id);

    const addDataUrl = `${process.env.NEXT_PUBLIC_HOST_API}${
        id
            ? process.env.NEXT_PUBLIC_EDIT_PRODUCT
            : process.env.NEXT_PUBLIC_ADD_PRODUCT
    }`;

    console.log("addDataUrl");
    console.log(addDataUrl);
    // adding new category
    const {
        data: addData = {},
        error: addError,
        loading: addLoading,
        executeFetch: addExecuteFetch,
    } = useFetch(addDataUrl, "post", { id, image }, false);
    const {
        data: editData = {},
        error: editError,
        loading: editLoading,
        executeFetch: editExecuteFetch,
    } = useFetch(addDataUrl, "post", {}, false);

    const {
        data: getData,
        error: getError,
        loading: getLoading,
    } = useFetch(
        process.env.NEXT_PUBLIC_HOST_API + process.env.NEXT_PUBLIC_GET_PRODUCT,
        "post",
        { id },
        true
    );

    const {
        data: categoryData = {},
        error: categoryError,
        loading: categoryLoading,
        executeFetch: categoryExecuteFetch,
    } = useFetch(
        process.env.NEXT_PUBLIC_HOST_API +
            process.env.NEXT_PUBLIC_LIST_CATEGORY,
        "get",
        {},
        false
    );

    const {
        data: brandData = {},
        error: brandError,
        loading: brandLoading,
        executeFetch: brandExecuteFetch,
    } = useFetch(
        process.env.NEXT_PUBLIC_HOST_API +
            process.env.NEXT_PUBLIC_LIST_PRODUCT_BRAND,
        "post",
        {},
        false
    );
    const {
        data: modelData = {},
        error: modelError,
        loading: modelLoading,
        executeFetch: modelExecuteFetch,
    } = useFetch(
        process.env.NEXT_PUBLIC_HOST_API +
            process.env.NEXT_PUBLIC_LIST_MODEL_PRODUCT,
        "post",
        {},
        false
    );

    var options = [];

    useEffect(() => {
        modelExecuteFetch();
    }, []);
    if (modelData?.description.length > 0) {
        console.log("come");
        options = [
            modelData.description.map((item) => {
                return { value: item.modelProducr };
            }),
        ];
    }

    console.log("modal", options[0]);

    const handleFormOnFinish = async (values) => {
        console.log(values);
        await form.validateFields();
        if (id) {
            console.log("test1");
            let formData = new FormData();
            formData.append("Name_ar", form.getFieldValue("Name_ar"));
            formData.append("Name_en", form.getFieldValue("Name_en"));
            formData.append("Offer", form.getFieldValue("Offer"));
            formData.append("Price", form.getFieldValue("Price"));
            formData.append("CatID", form.getFieldValue("Cat_id"));
            formData.append("ModelID", selectedModel);
            formData.append("desc_EN", value);
            formData.append("desc_AR", valueAr);
            formData.append("brandID", form.getFieldValue("brandID"));
            formData.append("id", id);
            console.log("formdata", formData);
            if (newImage.file !== null) {
                formData.append("Image", newImage.file);
            }
            addExecuteFetch(formData, true);
            return;
        }
        if (!newImage.file) {
            return false;
        }
        console.log("test2");
        let formData = new FormData();
        formData.append("Name_ar", form.getFieldValue("Name_ar"));
        formData.append("Name_en", form.getFieldValue("Name_en"));
        formData.append("Offer", form.getFieldValue("Offer"));
        formData.append("Price", form.getFieldValue("Price"));
        formData.append("CatID", form.getFieldValue("Cat_id"));
        formData.append("ModelID", selectedModel);
        formData.append("brandID", form.getFieldValue("brandID"));
        formData.append("desc_EN", value);
        formData.append("desc_AR", valueAr);
        formData.append("Image", newImage.file);
        console.log("formdata", formData);
        addExecuteFetch(formData, true);
    };

    const imageProps = {
        accept: "image/png, image/jpeg",
        showUploadList: false,
        disabled: newImage.file ?? false,
        onRemove: (file) => {
            setNewImage({ file: null, prev: null, validate: false });
        },
        beforeUpload: (file) => {
            if (file.size >= 1048576) {
                message.error("File size must be less than 1Mb");
                return false;
            }
            setNewImage((prev) => {
                setIsValid(false);
                console.log("image set");
                // validate image
                //     const validate = imageValidate(file);
                //     if (!validate) return prev;
                // set File
                let newObj = prev;
                newObj.file = file;
                newObj.prev = URL.createObjectURL(file);
                newObj.validate = false;
                return {
                    ...newObj,
                };
            });
            return false;
        },
        newImage,
    };
    //list of category
    const getCategoriesList = async () => {
        if (categoryData?.description?.length > 0) {
            return;
        } else {
            categoryExecuteFetch();
        }
    };
    //list of Model
    const getModelList = async () => {
        if (modelData?.description?.length > 0) {
            return;
        } else {
            modelExecuteFetch();
        }
    };
    //list of Brand
    const getBrandList = async () => {
        if (brandData?.description?.length > 0) {
            return;
        } else {
            brandExecuteFetch();
        }
    };
    // delete data
    const {
        data: deleteData = {},
        error: deleteError,
        loading: deleteLoading,
        executeFetch: deleteExecuteFetch,
    } = useFetch(
        process.env.NEXT_PUBLIC_HOST_API +
            process.env.NEXT_PUBLIC_DELETE_PRODUCT,
        "post",
        {},
        false
    );
    const {
        data = [],
        error,
        loading,
        executeFetch,
    } = useFetch(
        process.env.NEXT_PUBLIC_HOST_API + process.env.NEXT_PUBLIC_LIST_PRODUCT,
        "post",
        {},
        false
        // {
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //   },
        // }
    );

    // useEffect for delete Item
    useEffect(() => {
        if (deleteData?.status === true) {
            executeFetch();
            message.success("Product has been deleted successfully!");
            router.push(`/product-management/product`);
        } else if (deleteData?.status === false) {
            message.error(
                deleteError ?? "Something went wrong! Please try again later"
            );
        }
    }, [deleteData, deleteError, deleteLoading]);
    const handleDeleteItem = (id) => {
        Modal.confirm({
            title: "Are you sure about delete this product",
            content: <div>this product will be deleted forever !</div>,
            onOk() {
                deleteExecuteFetch({ id });
            },
        });
    };

    //useEffect for adding data
    useEffect(() => {
        if (addData?.status === true) {
            message.success("product has been added.");
            setNewId(addData?.description?.id);
            router.push(
                `/product-management/product/edit-product?id=${addData?.description?.id}&name=${addData?.description?.name_EN}&image=${addData?.description?.image}`
            );
        } else if (addData?.status === false) {
            message.error(
                addError ?? "Something went wrong! Please try again later"
            );
        }
    }, [addData, addError, addLoading]);

    // useFetch for getting data when page is edit
    useEffect(() => {
        if (id) {
            if (getData?.status === true) {
                console.log("getData", getData?.description);
                setShowActions(true);
                // adding data to from
                form.setFieldsValue({
                    Cat_id: getData?.description?.catID,
                    ModelID: getData?.description?.modelID,
                    brandID: getData?.description?.brandID,
                    Price: getData?.description?.price,
                    Offer: getData?.description?.offer,
                    Name_en: getData?.description?.name_EN,
                    Name_ar: getData?.description?.name_AR,
                });
                setValue(getData?.description?.desc_EN),
                    setValueAr(getData?.description?.desc_AR),
                    setImageFile({
                        prev:
                            process.env.NEXT_PUBLIC_HOST_API +
                            getData?.description?.primaryImage,
                        file: null,
                        validate: false,
                    });
            } else if (getData?.status === false) {
                message.error(
                    getData?.description ??
                        "Something went wrong! Please try again later."
                );
            }
        }
    }, [getData, getError, getLoading, id]);

    // Handle on select model
    const handleModelSelect = (e) => {
        const selected = modelData?.description.filter(
            (item) => item.modelProducr === e
        );
        setSelectedModel(selected[0].id);
        console.log("selected", selected[0].id);
    };

    //useEffect for editting data
    useEffect(() => {
        if (editData?.status === true) {
            message.success("Category has been edited.");
            router.push(
                `/product-management/product/edit-product?id=${addData?.description?.id}&image=${addData?.description?.image}&name=${addData?.description?.name_EN}`
            );
        } else if (editData?.status === false) {
            message.error(
                editError ?? "Something went wrong! Please try again later"
            );
        }
    }, [editData, editError, editLoading]);

    const menu = (
        <Menu>
            <Menu.Item key="1">
                <a
                    href="#"
                    onClick={(e) => {
                        e.preventDefault();
                        handleDeleteItem(id);
                    }}
                >
                    <DeleteOutlined style={{ color: "#f70202" }} />
                </a>
            </Menu.Item>
            <Menu.Item key="2">
                <a
                    href="#"
                    onClick={(e) => {
                        e.preventDefault();
                        editExecuteFetch(id, image);
                    }}
                >
                    <EditOutlined style={{ color: "#1dd3d5" }} />
                </a>
            </Menu.Item>

            <Menu.Item key="3">
                <Tooltip placement="top" title="Add Images">
                    <a
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            dispatch(
                                openDrawer(
                                    drawerType_AddImageToProperty,
                                    null,
                                    {
                                        productId: id,
                                        productName: name,
                                    },
                                    false
                                )
                            );
                        }}
                    >
                        <CameraOutlined style={{ color: "orange" }} />
                    </a>
                </Tooltip>
            </Menu.Item>
            <Menu.Item key="4">
                <Link
                    href={`/product-management/product/images?id=${id}&name=${name}`}
                >
                    <Tooltip placement="top" title="All Images">
                        <a href="#">
                            <IoMdImages
                                style={{ color: "green", fontSize: 18 }}
                            />
                        </a>
                    </Tooltip>
                </Link>
            </Menu.Item>
            <Menu.Item key="5">
                <Link
                    href={`/product-management/product/products-property?id=${id}&name=${name}`}
                >
                    General Properties
                </Link>
            </Menu.Item>
            <Menu.Item key="6">
                <Link
                    href={`/product-management/product/special-adjective?id=${id}&name=${name}`}
                >
                    Special Product
                </Link>
            </Menu.Item>
        </Menu>
    );
    return (
        <Main>
            <div className={style.box}>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleFormOnFinish}
                >
                    <Row>
                        <Col
                            span={12}
                            style={{
                                display: "flex",
                                justifyContent: "center",
                            }}
                        >
                            <Row>
                                <Col span={24}>
                                    <h2>Product Image</h2>{" "}
                                </Col>
                                <Col>
                                    <Upload {...imageProps}>
                                        {imageFile.prev || newImage.prev ? (
                                            <Image
                                                src={`${
                                                    newImage.prev
                                                        ? newImage.prev
                                                        : imageFile.prev
                                                }`}
                                                width={200}
                                                height={200}
                                            />
                                        ) : (
                                            <UploadFileComponent />
                                        )}
                                        <div>
                                            {newImage.prev ? (
                                                <span>
                                                    <Button
                                                        type="danger"
                                                        shape="circle"
                                                        onClick={() =>
                                                            setNewImage({
                                                                prev: null,
                                                                file: null,
                                                                validate: false,
                                                            })
                                                        }
                                                        style={{
                                                            display: "flex",
                                                            alignItems:
                                                                "center",
                                                            justifyContent:
                                                                "center",
                                                            padding: 10,
                                                        }}
                                                    >
                                                        <DeleteFilled
                                                            style={{
                                                                color: "white",
                                                                fontSize: 24,
                                                            }}
                                                        />
                                                    </Button>
                                                </span>
                                            ) : (
                                                <span>
                                                    <EditOutlined />{" "}
                                                    {newImage.prev ||
                                                    imageFile.prev
                                                        ? "Edit Image"
                                                        : "Add Image"}
                                                </span>
                                            )}
                                        </div>
                                    </Upload>
                                </Col>
                            </Row>
                        </Col>

                        <Col span={12}>
                            <Row gutter={[24, 32]}>
                                <Col span={12}>
                                    <h2>Product Information</h2>{" "}
                                </Col>

                                <Col span={12}>
                                    {showActions && (
                                        <Space size="large">
                                            <Dropdown
                                                overlay={menu}
                                                trigger={["click"]}
                                            >
                                                <a
                                                    onClick={(e) =>
                                                        e.preventDefault()
                                                    }
                                                >
                                                    <Space className="actions-btn">
                                                        Actions
                                                        <DownOutlined />
                                                    </Space>
                                                </a>
                                            </Dropdown>
                                        </Space>
                                    )}
                                </Col>
                                <Col span={24}>
                                    <Form.Item
                                        name="Cat_id"
                                        label="Parent Category"
                                    >
                                        <Select
                                            placeholder="Parent Category"
                                            onFocus={getCategoriesList}
                                            loading={categoryLoading}
                                        >
                                            {id && (
                                                <Select.Option
                                                    value={
                                                        getData?.description
                                                            ?.catID
                                                    }
                                                >
                                                    {
                                                        getData?.description
                                                            ?.categoryName
                                                    }
                                                </Select.Option>
                                            )}
                                            {categoryData?.description?.map(
                                                (item) => {
                                                    if (
                                                        id &&
                                                        (item.id ===
                                                            getData?.description
                                                                ?.catID ||
                                                            item.id ===
                                                                getData
                                                                    ?.description
                                                                    ?.categoryName)
                                                    )
                                                        return;
                                                    return (
                                                        <Select.Option
                                                            value={item.id}
                                                            key={item.id}
                                                        >
                                                            {item.name_EN}
                                                        </Select.Option>
                                                    );
                                                }
                                            )}
                                        </Select>
                                    </Form.Item>
                                </Col>

                                <Col span={24}>
                                    <Form.Item
                                        name="ModelID"
                                        label="Model "
                                        initialValue={selectedModel}
                                    >
                                        {/* <Select
                                            placeholder="ModelID"
                                            onFocus={getModelList}
                                            loading={modelLoading}
                                        >
                                            {id && (
                                                <Select.Option
                                                    value={
                                                        getData?.description
                                                            ?.modelID
                                                    }
                                                >
                                                    {
                                                        getData?.description
                                                            ?.modelName
                                                    }
                                                </Select.Option>
                                            )}
                                            {modelData?.description?.map(
                                                (item) => {
                                                    if (
                                                        id &&
                                                        (item.id ===
                                                            getData?.description
                                                                ?.modelID ||
                                                            item.id ===
                                                                getData
                                                                    ?.description
                                                                    ?.brandName)
                                                    )
                                                        return;
                                                    return (
                                                        <Select.Option
                                                            value={item.id}
                                                            key={item.id}
                                                        >
                                                            {item.modelProducr}
                                                        </Select.Option>
                                                    );
                                                }
                                            )}
                                        </Select> */}

                                        <AutoComplete
                                            style={{
                                                width: "100%",
                                            }}
                                            options={options[0]}
                                            placeholder="Search for model..."
                                            filterOption={(
                                                inputValue,
                                                option
                                            ) =>
                                                option.value
                                                    .toUpperCase()
                                                    .indexOf(
                                                        inputValue.toUpperCase()
                                                    ) !== -1
                                            }
                                            onSelect={(e) =>
                                                handleModelSelect(e)
                                            }
                                            required
                                        ></AutoComplete>
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item name="brandID" label="Brand ">
                                        <Select
                                            placeholder="Brand"
                                            onFocus={getBrandList}
                                            loading={brandLoading}
                                        >
                                            {id && (
                                                <Select.Option
                                                    value={
                                                        getData?.description
                                                            ?.brandID
                                                    }
                                                >
                                                    {
                                                        getData?.description
                                                            ?.brandName
                                                    }
                                                </Select.Option>
                                            )}
                                            {brandData?.description?.map(
                                                (item) => {
                                                    if (
                                                        id &&
                                                        (item.id ===
                                                            getData?.description
                                                                ?.brandID ||
                                                            item.id ===
                                                                getData
                                                                    ?.description
                                                                    ?.id)
                                                    )
                                                        return;
                                                    return (
                                                        <Select.Option
                                                            value={item.id}
                                                            key={item.id}
                                                        >
                                                            {item.name_EN}
                                                        </Select.Option>
                                                    );
                                                }
                                            )}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name="Name_en"
                                        label="Name English"
                                    >
                                        <Input
                                            placeholder="Name English"
                                            required
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name="Name_ar"
                                        label="Name Arabic"
                                    >
                                        <Input
                                            placeholder="Name Arabic"
                                            required
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item name="Price" label="Price">
                                        <Input placeholder="Price" required />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item name="Offer" label="Offer ">
                                        <Input placeholder="Offer " />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={24}>
                            <h2>Description in english</h2>
                            <ReactQuill
                                name="desc_EN"
                                onChange={setValue}
                                value={value}
                                theme="snow"
                            />
                        </Col>
                        <Col span={24}>
                            <h2>Description in arabic</h2>
                            <ReactQuill
                                name="desc_AR"
                                onChange={setValueAr}
                                value={valueAr}
                                theme="snow"
                            />
                        </Col>
                        <Col span={24}>
                            <Button
                                htmlType="submit"
                                type="primery"
                                style={{ margin: "10px 0" }}
                                disabled={isValid}
                            >
                                Submit
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </div>
        </Main>
    );
}

export default withCookies(AddProduct);
