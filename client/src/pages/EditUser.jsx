import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { login } from "../features/auth/authSlice";
import {
  Button,
  ChangePassword,
  Container,
  Input,
  UpdateAvatar,
} from "../components/index";
import { getUserProfile, updateAvatar, updateUser } from "../api/index";
import { useForm } from "react-hook-form";

function EditUser() {
  const [userData, setUserData] = useState(
    useSelector((state) => state.auth.data)
  );
  const [avatar, setAvatar] = useState("");
  const [isError, setIsError] = useState("");

  const { register, handleSubmit } = useForm();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // TODOD: call api on image select
  const updateUserAvatar = async (e) => {
    const updateAvatarToast = toast.loading("Updating Avatar...");

    const formData = new FormData();
    formData.append("avatar", e.target.files[0]);
    try {
      const response = await updateAvatar(formData);
      console.log("🚀 ~ updateAvatar ~ response:", response);

      dispatch(login(response.data));
      setUserData(response.data);

      toast.success("Avatar update successfully.", {
        id: updateAvatarToast,
      });
    } catch (error) {
      console.log("🚀 ~ updateAvatar ~ error:", error);

      toast.error(`Error: ${error.response.data.message}`, {
        id: updateAvatarToast,
      });
    }
  };

  const submit = async (data) => {
    const updateUserToast = toast.loading("Updating your details.");

    try {
      const response = await updateUser(data);
      console.log("🚀 ~ updateUser ~ response:", response);

      toast.success("User details updated successfully.", {
        id: updateUserToast,
      });
      dispatch(login(response.data));
      // navigate(`/u/${response.data.username}`);
    } catch (error) {
      console.log("🚀 ~ updateUser ~ error:", error);

      toast.error(
        `Error: ${error.response?.data?.message || "Error while updating user information."}`,
        {
          id: updateUserToast,
        }
      );
    }
  };

  useEffect(() => {}, [avatar]);

  return (
    <div className="my-10">
      <Container>
        <h1 className="mb-6 text-3xl font-bold">Edit Profile</h1>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="row-span-2 rounded-xl border border-slate-300 p-7 shadow md:col-span-2">
            <h2 className="mb-6 text-xl font-semibold">Personal Information</h2>

            <form className="space-y-4" onSubmit={handleSubmit(submit)}>
              <Input
                id="name"
                label="Name"
                placeholder="John Doe"
                {...register("name", {
                  value: userData.name,
                  required: true,
                })}
              />
              <Input
                id="username"
                label="Username"
                placeholder="johndoe"
                {...register("username", {
                  value: userData.username,
                  required: true,
                })}
              />
              <Input
                label="Email"
                type="email"
                placeholder="john.doe@example.com"
                {...register("email", {
                  value: userData.email,
                  required: true,
                })}
              />
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="gender"
                  className="text-base font-medium capitalize text-gray-900"
                >
                  Gender:
                </label>
                <select
                  name="gender"
                  id="gender"
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3 py-2.5 text-gray-900"
                  {...register("gender", {
                    value: userData.gender,
                  })}
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <Button
                type="submit"
                className="w-full bg-zinc-800 hover:bg-zinc-900"
              >
                Save Changes
              </Button>
            </form>
          </div>

          <div className="rounded-xl border border-slate-300 p-7 shadow md:col-span-1">
            <UpdateAvatar userData={userData} setUserData={setUserData} />
          </div>

          <div className="rounded-xl border border-slate-300 p-7 shadow md:col-span-1">
            <ChangePassword />
          </div>
        </div>
      </Container>
    </div>
  );
}

export default EditUser;
