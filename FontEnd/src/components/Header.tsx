import { imgString } from "@/helpers";
import { useProfile } from "@/hooks/useProfile";
import { Menu } from "@/icons/Menu";
import useCartStore from "@/store/cartStore";
import { Button } from "@/ui/Button";
import { IconButton } from "@/ui/IconButton";
import { Caption } from "@/ui/typography/Caption";
import { Subtitle } from "@/ui/typography/Subtitle";
import { useNavigate, useLocation } from "react-router-dom";

const logo = import.meta.env.VITE_LOGO_URL;

export const Header = () => {
  const { profile, setShowMobileMenu, showMobileMenu } = useProfile();
  const navigate = useNavigate();
  const location = useLocation();

  const { handleCloseCart } = useCartStore();

  return (
    <div className="flex items-center justify-between h-[56px] sm:h-[77px] border-b bg-white border-neutral-200 py-3 sm:py-5 px-5 sm:px-8">
      <div className="sm:relative opacity-0 sm:opacity-100">
        <Subtitle color="text-neutral-500">Bom dia, </Subtitle>
        <Subtitle variant="small-semibold">{profile?.name?.split(" ")[0]}!</Subtitle>
      </div>
      <div className="static sm:hidden">
        <img src={logo} alt="logo" />
      </div>

      <div className="flex items-center gap-6">
        {location.pathname === "/sales" &&
          profile?.Roles?.length &&
          profile?.Roles?.find((role) => role?.name === "seller_local") && (
            <Button
              className=" sm:h-11 h-10 "
              variant="primary"
              color="destruct"
              onClick={handleCloseCart}
            >
              Fechar caixa
            </Button>
          )}

        <div className="static sm:hidden">
          <IconButton
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            size="small"
            variant="filled"
          >
            <Menu />
          </IconButton>
        </div>

        <img
          src={imgString(profile?.dataImage?.data)}
          alt="Avatar"
          className="sm:relative opacity-0 sm:opacity-100 w-10 h-10 rounded-full"
        />
        <div
          onClick={() => navigate("/profile")}
          className="sm:relative opacity-0 sm:opacity-100 cursor-pointer"
        >
          <Caption variant="large-semibold">{profile?.name}</Caption>
          <Caption variant="small" color="text-neutral-500">
            {profile?.email}
          </Caption>
        </div>
      </div>
    </div>
  );
};
