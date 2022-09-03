// redux
import { useDispatch, useSelector } from "react-redux";
import * as constants from "../../redux/modal/constants";
//components

import AddRole from "../modals/Role/add-role";
import AddModel from "../modals/model-product/add-model";
import CategoryModal from "../modals/category/category-modal";
import AddSpecialAdjective from "../modals/product/special-adjective";
import GeneralPropertyModal from "../modals/product/general-property-modal";
import LinkProductToPropertyModal from "../modals/product/link-product-property";
import AddImagePropertyModal from "../modals/product/add-image-property-modal";
import AddBrand from "../modals/brand/brand-modal";
import AddColor from "../modals/color/color-modal";
import AddSize from "../modals/size/size-modal";
function ModalContainer() {
  const { visible, modalType } = useSelector((state) => state.modal);
  const dispacth = useDispatch();

  return (
    <>
      {modalType === constants.modalType_AddRole && (
        <AddRole visible={visible} />
      )}
      {modalType === constants.modalType_AddModel && (
        <AddModel visible={visible} />
      )}
      {modalType === constants.modalType_Category && (
        <CategoryModal visible={visible} />
      )}
      {modalType === constants.modalType_AddSpecialAdjective && (
        <AddSpecialAdjective visible={visible} />
      )}

      {modalType === constants.modalType_AddGeneralProperty && (
        <GeneralPropertyModal visible={visible} />
      )}
      {modalType === constants.modalType_LinkProductToProperty && (
        <LinkProductToPropertyModal visible={visible} />
      )}
      {modalType === constants.modalType_AddImageToProperty && (
        <AddImagePropertyModal visible={visible} />
      )}
      {modalType === constants.modalType_AddBrand && (
        <AddBrand visible={visible} />
      )}
      {modalType === constants.modalType_AddColor && (
        <AddColor visible={visible} />
      )}
      {modalType === constants.modalType_AddSize && (
        <AddSize visible={visible} />
      )}
    </>
  );
}

export default ModalContainer;
