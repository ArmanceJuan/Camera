document.addEventListener("DOMContentLoaded", () => {
  const cameraSelect = document.getElementById("cameraSelect");
  const valideButton = document.getElementById("valideButton");
  const cameraElement = document.getElementById("cameraElement");
  const photoButton = document.getElementById("photoButton");
  const photo = document.getElementById("photo");
  const savePhoto = document.getElementById("savePhoto");

  if ("mediaDevices" in navigator && "getUserMedia" in navigator.mediaDevices) {
    console.log("Périphériques pris en compte");
  }

  navigator.mediaDevices.getUserMedia({ video: true, width: 800, height: 600 });

  const getVideoDevices = () => {
    return navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => {
        return devices.filter((device) => device.kind === "videoinput");
      })
      .catch((error) => {
        console.error("Erreur péripherique");
      });
  };

  const cameraList = (devices) => {
    devices.forEach((device) => {
      const option = document.createElement("option");
      option.text = device.label || `Camera ${cameraSelect.length + 1}`;
      option.value = device.deviceId;
      cameraSelect.appendChild(option);
    });

    if (cameraSelect.children.length === 0) {
      const option = document.createElement("option");
      option.text = "Aucune webcam trouvée";
      cameraSelect.appendChild(option);
    }
  };

  getVideoDevices()
    .then((devices) => {
      cameraList(devices);
    })
    .catch((error) => {
      console.error("Erreur lors de la récupération des périphériques", error);
    });

  const openCamera = () => {
    const cameraID = cameraSelect.value;
    navigator.mediaDevices
      .getUserMedia({
        video: {
          deviceId: cameraID ? { exact: cameraID } : undefined,
        },
      })
      .then((stream) => {
        cameraElement.srcObject = stream;
      })
      .catch((error) => {
        console.error("Erreur", error);
      });
  };

  const takePhoto = () => {
    const canvas = document.createElement("canvas");
    canvas.width = cameraElement.videoWidth;
    canvas.height = cameraElement.videoHeight;
    canvas.getContext("2d").drawImage(cameraElement, 0, 0);
    photo.src = canvas.toDataURL("image/png");
    savePhoto.href = photo.src;
    savePhoto.download = "webcam_photo.png";

    photo.style.display = "block";
    photo.alt = "photo webcam";
  };

  const saveImage = () => {
    savePhoto.click();
  };

  valideButton.addEventListener("click", () => {
    openCamera();
  });

  photoButton.addEventListener("click", () => {
    takePhoto();
  });

  savePhoto.addEventListener("click", () => {
    saveImage();
    console.log("image enregistré");
  });
});
