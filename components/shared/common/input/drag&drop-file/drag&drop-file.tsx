"use client";
import React, { useEffect } from "react";
import "./drag&drop-file.css";
import Image from "next/image";

export default function DragAndDropFile({
  ChangeImage,
}: {
  ChangeImage: (file: any) => void;
}) {
  const changeEventRegistered = React.useRef(false);
  // const [imageSrc, setImageSrc] = React.useState(
  //   "https://images.pexels.com/photos/20631973/pexels-photo-20631973/free-photo-of-g-anh-sang-ngh-thu-t-mua-dong.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"
  // );

  useEffect(() => {
    let file: File | null;
    // Selecting all required elements
    const dropArea = document.querySelector(".drag-area");
    const dragText = dropArea?.querySelector("header");
    const button = dropArea?.querySelector("button");
    const input = dropArea?.querySelector("input");
    const image = dropArea?.querySelectorAll("img");
    const labelForImage = dropArea?.querySelector("#labelForIamge");
    // Declare the file variable
    if (!changeEventRegistered.current) {
      input?.addEventListener("change", function () {
        // Getting user selected file and [0] this means if user selects multiple files then we'll select only the first one
        file = this.files ? this.files[0] : null; // Get the selected file
        dropArea?.classList.add("active");
        showFile(); // Calling function to display the file
      });
      changeEventRegistered.current = true;
    }

    // If user drags file over dropArea
    dropArea?.addEventListener("dragover", (event) => {
      event.preventDefault(); // Preventing default behavior
      dropArea.classList.add("active");
      if (dragText) {
        dragText.textContent = "Release to Upload File";
      }
    });

    // If user leaves dragged file from dropArea
    dropArea?.addEventListener("dragleave", () => {
      dropArea.classList.remove("active");
      if (dragText) {
        dragText.textContent = "Drag & Drop to Upload File";
      }
    });

    // If user drops file on dropArea
    dropArea?.addEventListener("drop", (event: any) => {
      event.preventDefault(); // Preventing default behavior
      // Getting user selected file and [0] this means if user selects multiple files then we'll select only the first one
      file = event.dataTransfer.files[0];

      dropArea.classList.add("active");
      showFile(); // Calling function to display the file
    });

    function showFile() {
      const fileType = file?.type; // Getting selected file type
      const validExtensions = ["image/jpeg", "image/jpg", "image/png"]; // Adding some valid image extensions in array
      if (fileType && validExtensions.includes(fileType)) {
        ChangeImage(file);
        // If user selected file is an image file
        const fileReader = new FileReader(); // Creating new FileReader object
        fileReader.onload = () => {
          const fileURL = fileReader.result;

          if (dropArea && image && labelForImage) {
            // setImageSrc(fileURL?.toString() as string);
            // console.log("Imgaesrc", imageSrc);
            (labelForImage as HTMLLabelElement).hidden = false;
            const mainIamge = document.getElementsByClassName(
              "main_image"
            )[0] as HTMLImageElement;
            mainIamge.removeAttribute("hidden");
            mainIamge.setAttribute("srcset", fileURL?.toString() as string);
            // mainIamge.src = fileURL?.toString() as string;
          } // Adding that created img tag inside dropArea container
        };
        if (file) fileReader.readAsDataURL(file);
      } else {
        alert("This is not an Image File!");
        dropArea?.classList.remove("active");
        if (dragText) {
          dragText.textContent = "Drag & Drop to Upload File";
        }
      }
    }
  }, [ChangeImage]);

  return (
    <div>
      <div className="drag-area relative w-full">
        <div className="icon">
          <i className="fas fa-cloud-upload-alt"></i>
        </div>

        <header>Drag & Drop to Upload File</header>
        <span>OR</span>
        <label className="w-max h-max" htmlFor="file">
          Browse File
        </label>
        <label
          id="labelForIamge"
          className="label_image w-max h-max"
          htmlFor="file"
          hidden
        >
          <Image
            alt=""
            hidden={true}
            src={
              "https://images.pexels.com/photos/20631973/pexels-photo-20631973/free-photo-of-g-anh-sang-ngh-thu-t-mua-dong.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"
            }
            width={1000}
            height={1000}
            className="absolute top-0 left-0 w-full h-full object-cover z-50 main_image"
          />
        </label>
        <input type="file" hidden id="file" src="" />
      </div>
    </div>
  );
}
