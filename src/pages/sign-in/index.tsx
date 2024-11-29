import { Button, Typography, styled } from "@mui/material";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import GoogleIcon from "../../assets/GoogleIcon.svg?react";
import SigninImg from "../../assets/SigninImg.svg?react";
import TodoList from "../../assets/Todolist.svg?react";
import { UserAuth } from "../../context/auth";

const MainContainer = styled("div")({
  display: "flex",
  width: "100%",
  height: "100%",
  overflow: "hidden",
  backgroundColor: "#F0F0FF",
});

const LeftContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  minWidth: "30%",
  padding: "0 60px",
});

const RightContainer = styled("div")({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minWidth: "70%",
  paddingTop: "80px",
  position: "relative",
});

const SignInButton = styled(Button)({
  backgroundColor: "#292929",
  color: "#FFFFFF",
  borderRadius: "20px",
  padding: "12px",
  textTransform: "none",
  fontWeight: "700",
  fontSize: "20px",
});

const Ellipse = styled("div")({
  border: "1px solid",
  borderColor: "#5C55E5",
  borderRadius: "50%",
});

export default function Signin() {
  const { googleSignIn, user } = UserAuth();
  let navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user !== null) {
      navigate("/dashboard");
    }
  }, [user]);

  return (
    <MainContainer>
      <LeftContainer>
        <TodoList
          style={{
            width: "170px",
            marginLeft: "-6px",
            marginBottom: "5px",
          }}
        />
        <Typography sx={{ marginBottom: "28px" }}>
          Streamline your workflow and track progress effortlessly with our
          all-in-one task management app.
        </Typography>
        <SignInButton startIcon={<GoogleIcon />} onClick={handleGoogleSignIn}>
          Continue with Google
        </SignInButton>
      </LeftContainer>
      <RightContainer>
        <Ellipse
          sx={{
            borderColor: "rgba(92, 85, 229, 0.5)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "60px 60px 90px 60px",
          }}
        >
          <Ellipse
            sx={{
              borderColor: "rgba(92, 85, 229, 0.5)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: "70px 70px 90px 70px",
            }}
          >
            <Ellipse
              sx={{
                width: "600px",
                height: "600px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            ></Ellipse>
          </Ellipse>
        </Ellipse>
        <SigninImg
          style={{
            position: "absolute",
            left: "320",
            width: "900px",
            height: "900px",
            top: "0",
          }}
        />
      </RightContainer>
    </MainContainer>
  );
}
