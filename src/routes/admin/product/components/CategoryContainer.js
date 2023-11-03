import React from 'react';
import CategoryTable from './CategoryTable';
import '../index.less'

function CategoryContainer({
  pageType,
  isLoad,
  idCategory,
  dataCategory,
  setDataCategory,
  setIdCategory,
  setInputSearch,
  setDisabledStep,
  setCategorySubmit,
  categoryArr,
  setCategoryArr,
}) {

  return (
    <>
      <div className="table-category ">
        <p className="text-2xl font-bold text-teal-900 mb-8">Thêm mới sản phẩm</p>
        <div className="bg-white p-4 rounded-[10px] overflow-x-auto">
          <h2 className="text-teal-900 font-medium text-base pb-2">Vui lòng chọn danh mục sản phẩm</h2>
          <div className="grid grid-cols-3 gap-4 overscroll-auto hover:overscroll-contain category w-[900px]">
            <div className="block-category">
              <CategoryTable
                pageType={pageType}
                textTitle=" Danh mục chính"
                isLoad={isLoad.loadingMain}
                idCategory={idCategory.idCategoryMain}
                dataSource={dataCategory.dataCategoryMain}
                setDataSource={setDataCategory}
                setIdCategory={(id) => setIdCategory((prev) => ({ ...prev, idCategoryMain: id }))}
                handleSearch={(e) => setInputSearch((prev) => ({ ...prev, search: e.target.value }))}
                handleSaveBreadcrumb={(record) => {
                  if (!record) return;
                  setCategoryArr((prev) => {
                    const arr = [...prev];
                    arr[0] = record;
                    arr[1] = '';
                    arr[2] = '';
                    arr[3] = '';
                    arr[4] = '';
                    return arr;
                  });
                }}
              />
            </div>
            <div className="block-category">
              <CategoryTable
                pageType={pageType}
                textTitle="Danh mục cấp 1"
                isLoad={isLoad.loading1}
                idCategory={idCategory.idCategory1}
                dataSource={dataCategory.dataCategory1}
                setIdCategory={(id) => setIdCategory((prev) => ({ ...prev, idCategory1: id }))}
                handleSearch={(e) =>
                  setInputSearch((prev) => ({
                    ...prev,
                    search1: e.target.value,
                    search2: '',
                    search3: '',
                    search4: '',
                  }))
                }
                handleSaveBreadcrumb={(record) => {
                  if (!record) return;
                  setCategoryArr((prev) => {
                    const arr = [...prev];
                    arr[1] = record;
                    arr[2] = '';
                    arr[3] = '';
                    arr[4] = '';
                    return arr;
                  });
                }}
              />
            </div>
            <div className="block-category">
              <CategoryTable
                pageType={pageType}
                textTitle="Danh mục cấp 2"
                isLoad={isLoad.loading2}
                idCategory={idCategory.idCategory2}
                dataSource={dataCategory.dataCategory2}
                setIdCategory={(id) => setIdCategory((prev) => ({ ...prev, idCategory2: id }))}
                handleSearch={(e) =>
                  setInputSearch((prev) => ({ ...prev, search2: e.target.value, search3: '', search4: '' }))
                }
                handleSaveBreadcrumb={(record) => {
                  setCategoryArr((prev) => {
                    const arr = [...prev];
                    arr[2] = record;
                    arr[3] = '';
                    arr[4] = '';
                    return arr;
                  });
                }}
              />
            </div>
            {/* <div className="block-category">
              <CategoryTable
                pageType={pageType}
                textTitle="Danh mục cấp 3"
                isLoad={isLoad.loading3}
                idCategory={idCategory.idCategory3}
                dataSource={dataCategory.dataCategory3}
                setIdCategory={(id) => setIdCategory((prev) => ({ ...prev, idCategory3: id }))}
                handleSearch={(e) => setInputSearch((prev) => ({ ...prev, search3: e.target.value, search4: '' }))}
                handleSaveBreadcrumb={(record) => {
                  setCategoryArr((prev) => {
                    const arr = [...prev];
                    arr[3] = record;
                    arr[4] = '';
                    return arr;
                  });

                }}
              />
            </div> */}
            {/* <div className="block-category">
              <CategoryTable
                pageType={pageType}
                textTitle="Danh mục cấp 4"
                isLoad={isLoad.loading4}
                idCategory={idCategory.idCategory4}
                dataSource={dataCategory.dataCategory4}
                setIdCategory={(id) => {
                  setCategorySubmit(id);
                  setIdCategory((prev) => ({ ...prev, idCategory4: id }));
                  setDisabledStep(false);
                }}
                handleSearch={(e) => setInputSearch((prev) => ({ ...prev, search4: e.target.value }))}
                handleSaveBreadcrumb={(record) => {
                  setCategoryArr((prev) => {
                    const arr = [...prev];
                    arr[4] = record;
                    return arr;
                  });
                }}
              />
            </div> */}
          </div>
          <div className="mt-2">
            <span className="font-bold text-base text-teal-900 mr-3">Danh mục đã chọn: </span>
            {categoryArr.map((item, index) => {
              if (item !== null && item !== undefined && item !== '') {
                return <span key={index}>{index === 0 ? item.name : ' > ' + item.name} </span>;
              }
              return true;
            })}
          </div>
        </div>

      </div>
    </>
  );
}

export default CategoryContainer;
