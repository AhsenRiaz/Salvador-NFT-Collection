const fs = require("fs"); // import the fs module
const sizeOf = require("image-size");
const path = require("path");

// specify the path to the folder containing the images
const imgFolder = "./images";
const basePath = process.cwd();
const buildDir = `${basePath}/build/json`;

const name = "The Charles Salvador Bronson Collection";
const description =
  "It's good for the soul, I found the art, I live for art, art is my life. I am going to do my art and create masterpiece";

const baseUri = "ipfs/QmfCQFFvXPpQEvJfUtUmjC6z7x7CXEV9aaLsxuPGDSSimQ";

// array to store all the JSON objects
var jsonDataArray = [];

// read the contents of the folder
fs.readdir(imgFolder, (err, files) => {
  if (err) {
    console.error(err);
    return;
  }

  // loop through the files (which should be the images)
  files.forEach((file) => {
    // create a new folder with the same name as the image
    let shortName = file.replace(/\.[^/.]+$/, "");
    let extension = path.extname(file);
    // set the source of the image to the file path
    let image = imgFolder + "/" + file;
    const width = sizeOf(image).width;
    const jsonData = {
      name: `${name} #${shortName}`,
      description: description,
      image: `${baseUri}/${shortName}${extension}`,
      attributes: [
        {
          trait_type: "Type",
          value: "",
        },
        {
          trait_type: "Rarity",
          value: "",
        },
      ],
    };

    if (shortName <= 200) {
      jsonData.attributes[0].value = "Unique";
      if (width == 4961) {
        console.log("Super Rare");
        jsonData.attributes[1].value = "Super Rare";
      } else if (width == 3508) {
        console.log("Rare");
        jsonData.attributes[1].value = "Rare";
      } else {
        jsonData.attributes[1].value = "Uncommon";
      }
    } else {
      jsonData.attributes[0].value = "3d";
      if (width == 4961) {
        jsonData.attributes[1].value = "Super Rare";
      } else if (width == 3508) {
        jsonData.attributes[1].value = "Rare";
      } else {
        jsonData.attributes[1].value = "Uncommon";
      }
    }

    fs.writeFile(
      `${buildDir}/${shortName}.json`,
      JSON.stringify(jsonData, null, 2),
      function (err) {
        if (err) throw err;
        console.log("Saved!");
      }
    );

    jsonDataArray.push(jsonData); // add the JSON object to the array

    writeMetaData(JSON.stringify(jsonDataArray, null, 2));
  });
});

const writeMetaData = (_data) => {
  fs.writeFileSync(`${buildDir}/_metadata.json`, _data);
};
