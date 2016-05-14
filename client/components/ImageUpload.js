import React, { Component } from 'react';
import { connect } from 'react-redux';
import actions from '../actions/index.js';
import { fetchFPKey } from '../utils/utils';
const filepicker = require('filepicker-js');

let FILE_PICKER_KEY;
if (process.env.FILE_PICKER_KEY) {
  FILE_PICKER_KEY = process.env.FILE_PICKER_KEY;
} else if (process.env.HEROKU) {
  console.log('fetching key from process.env...');
  FILE_PICKER_KEY = fetchFPKey(console.log);
} else if (!process.env.TRAVIS && !process.env.HEROKU) {
  FILE_PICKER_KEY = require('../../server/keys/filePicker.js').FILE_PICKER_KEY;
}
console.log('FILE_PICKER_KEY', FILE_PICKER_KEY);

class ImageUpload extends Component {
  render() {
    const { recipe, uploadPicture } = this.props;
    return (
      <div>
        <button onClick={() => uploadPicture(recipe)}>Add Pics</button>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    recipe: state.recipe,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    uploadPicture: (recipe) => {

      filepicker.setKey(FILE_PICKER_KEY);
      filepicker.pick(
        {
          mimetype: 'image/*',
          container: 'window',
        },
        (data) => {
          const newSet = { images: recipe.images };
          newSet.images.push(data.url);
          dispatch(actions.editRecipe(newSet));
        },
        (error) => console.log(error)
      );
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ImageUpload);
