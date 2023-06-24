import React, { useState, useCallback, useEffect,memo,useContext,useRef } from 'react';

const PrintComponent = React.forwardRef((props, ref) => {
    return (
      <div ref={ref}>My cool content here!</div>
    );
})

export default PrintComponent;
