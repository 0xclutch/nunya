import React from "react";



const Settings = () => {
    const removePasskey = async () => {
        if (!user) return;
      
        const { error } = await supabase
          .from("user_credentials")
          .delete()
          .eq("user_id", user.id);
      
        if (error) {
          message.error("Failed to remove Face ID. Try again.");
          console.error(error);
        } else {
          message.success("Face ID removed successfully.");
        }
      };



    return (
        <>

        </>
    )
};