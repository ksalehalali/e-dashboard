// redux
import { useSelector } from "react-redux";
import * as constants from "@/redux/drawer/constants";
// components
import AddImagePropertyDrawer from "../drawers/products/add-image-property-drawer";
function DrawerContainer() {
  const { visible, drawerType } = useSelector((state) => state.drawer);
  return (
    <>
      {constants.drawerType_AddImageToProperty === drawerType && (
        <AddImagePropertyDrawer visible={visible} />
      )}
    </>
  );
}

export default DrawerContainer;
