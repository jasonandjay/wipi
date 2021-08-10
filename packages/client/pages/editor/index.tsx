import React, { useEffect } from 'react';
import { NextPage } from 'next';
import Context from '@/lib/editor/context';
// import useDispatch from '@/lib/editor/hooks/use-dispatch';
// import useSelector from '@/lib/editor/hooks/use-selector';
// import View from './components/view';
// import Loading from '@/lib/editor/components/loading';
import { lang } from '@/lib/editor/config';

const Editor: NextPage = () => {
//   const dispatch = useDispatch();

//   useEffect(() => {
//     dispatch({
//     //   type: 'doc/get',
//     });
//   }, []);

//   const doc = useSelector((state) => state.doc);
//   const loadingState = useSelector((state) => state.loading['doc/get']);

//   if (loadingState !== false) {
//     return <Loading />;
//   }

  return (
    <Context.Provider value={{ lang }}>
      {/* <View content={doc.value} /> */}
      <div>123</div>
    </Context.Provider>
  );
};

export default Editor;
