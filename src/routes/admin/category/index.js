import { Message, Spin } from 'components';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import { CategoryService } from 'services/category';
import { CategoryAboveSection, CategoryBellowSection } from './components/CategoryCommonSection';
import CategoryTable from './components/CategoryTable';
import useDebounce from './hooks/useDebouce';
import './index.less';
const Page = () => {
  const [dataCategory, setDataCategory] = useState({
    dataCategoryMain: [],
    dataCategory1: [],
    dataCategory2: [],
    dataCategory3: [],
    dataCategory4: [],
  });

  const [InputSeach, setInputSearch] = useState({
    search: '',
    search1: '',
    search2: '',
    search3: '',
    search4: '',
  });
  const [idParent, setIdParent] = useState({
    mainParent: '',
    parent1: '',
    parent2: '',
    parent3: '',
    parent4: '',
  });

  const [valueSearch, setValueSearch] = useState({
    valueSearch: InputSeach.search,
    valueSearch1: InputSeach.search1,
    valueSearch2: InputSeach.search2,
    valueSearch3: InputSeach.search3,
    valueSearch4: InputSeach.search4,
  });

  const [isLoad, setIsLoad] = useState({
    loadingMain: false,
    loading1: false,
    loading2: false,
    loading3: false,
    loading4: false,
  });

  const searchDebounce = useDebounce(InputSeach.search, 500);
  const searchDebounce1 = useDebounce(InputSeach.search1, 500);
  const searchDebounce2 = useDebounce(InputSeach.search2, 500);
  const searchDebounce3 = useDebounce(InputSeach.search3, 500);
  const searchDebounce4 = useDebounce(InputSeach.search4, 500);

  const scrollRef = useRef();

  useEffect( () => {
    const initDataCategory = async () => {
      setIsLoad((prev) => ({ ...prev, loadingMain: true }));
      try {
        const res = await CategoryService.get({ fullTextSearch: searchDebounce });
        setDataCategory((prev) => ({
          ...prev,
          dataCategoryMain: res.data,
          dataCategory1: [],
          dataCategory2: [],
          dataCategory3: [],
          dataCategory4: [],
        }));
        setIdParent((prev) => ({
          ...prev,
          mainParent: '',
          parent1: '',
          parent2: '',
          parent3: '',
          parent4: '',
        }));
        if (searchDebounce) {
          setDataCategory((prev) => ({
            ...prev,
            dataCategory1: [],
            dataCategory2: [],
            dataCategory3: [],
            dataCategory4: [],
          }));
          setIdParent((prev) => ({
            ...prev,
            mainParent: '',
            parent1: '',
            parent2: '',
            parent3: '',
            parent4: '',
          }));
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoad((prev) => ({ ...prev, loadingMain: false }));
      }
    };
    initDataCategory();
  }, [searchDebounce]);

  useEffect( () => {
    const initDataCategory = async () => {
      if (idParent.mainParent) {
        setIsLoad((prev) => ({ ...prev, loading1: true }));
        try {
          const res = await CategoryService.get({ id: idParent.mainParent, fullTextSearch: searchDebounce1 });
          setDataCategory((prev) => ({
            ...prev,
            dataCategory1: res.data,
            dataCategory2: [],
            dataCategory3: [],
            dataCategory4: [],
          }));
          setIdParent((prev) => ({
            ...prev,
            parent1: '',
            parent2: '',
            parent3: '',
            parent4: '',
          }));
          if (searchDebounce1) {
            setDataCategory((prev) => ({
              ...prev,
              dataCategory2: [],
              dataCategory3: [],
              dataCategory4: [],
            }));
            setIdParent((prev) => ({
              ...prev,
              parent1: '',
              parent2: '',
              parent3: '',
              parent4: '',
            }));
          }
        } catch (error) {
          console.log(error);
        } finally {
          setIsLoad((prev) => ({ ...prev, loading1: false }));
        }
      }
    };
    initDataCategory();
  }, [idParent.mainParent, searchDebounce1]);

  useEffect( () => {
    const initDataCategory = async () => {
      if (idParent.parent1) {
        setIsLoad((prev) => ({ ...prev, loading2: true }));
        try {
          const res = await CategoryService.get({ id: idParent.parent1, fullTextSearch: searchDebounce2 });
          setDataCategory((prev) => ({ ...prev, dataCategory2: res.data, dataCategory3: [], dataCategory4: [] }));
          setIdParent((prev) => ({
            ...prev,
            parent2: '',
            parent3: '',
            parent4: '',
          }));
          if (searchDebounce2) {
            setDataCategory((prev) => ({
              ...prev,
              dataCategory3: [],
              dataCategory4: [],
            }));
            setIdParent((prev) => ({
              ...prev,
              parent2: '',
              parent3: '',
              parent4: '',
            }));
          }
        } catch (error) {
          console.log(error);
        } finally {
          setIsLoad((prev) => ({ ...prev, loading2: false }));
        }
      }
    };
    initDataCategory();
  }, [idParent.parent1, searchDebounce2]);

  useEffect( () => {
    const initDataCategory = async () => {
      if (idParent.parent2) {
        setIsLoad((prev) => ({ ...prev, loading3: true }));
        try {
          const res = await CategoryService.get({ id: idParent.parent2, fullTextSearch: searchDebounce3 });
          setDataCategory((prev) => ({ ...prev, dataCategory3: res.data, dataCategory4: [] }));
          setIdParent((prev) => ({
            ...prev,
            parent3: '',
            parent4: '',
          }));
          // setDataCategory4([])
          if (searchDebounce3) {
            setDataCategory((prev) => ({
              ...prev,
              dataCategory4: [],
            }));
            setIdParent((prev) => ({
              ...prev,
              parent3: '',
              parent4: '',
            }));
          }
        } catch (error) {
          console.log(error);
        } finally {
          setIsLoad((prev) => ({ ...prev, loading3: false }));
        }
      }
    };
    initDataCategory();
  }, [idParent.parent2, searchDebounce3]);

  useEffect( () => {
    const initDataCategory = async () => {
      if (idParent.parent3) {
        setIsLoad((prev) => ({ ...prev, loading4: true }));
        try {
          const res = await CategoryService.get({ id: idParent.parent3, fullTextSearch: searchDebounce4 });
          setDataCategory((prev) => ({ ...prev, dataCategory4: res.data }));
          setIdParent((prev) => ({
            ...prev,
            parent4: '',
          }));
        } catch (error) {
          console.log(error);
        } finally {
          setIsLoad((prev) => ({ ...prev, loading4: false }));
        }
      }
    };
    initDataCategory();
  }, [idParent.parent3, searchDebounce4]);

  const handleAdd = async (e) => {
    typeof e !== 'string' && e.preventDefault();
    if (typeof e === 'string') {
      if (!e) return;
    } else {
      if (!e.target.value) {
        return;
      }
    }
    if (searchDebounce) {
      setInputSearch((prev) => ({ ...prev, search: '', search1: '', search2: '', search3: '', search4: '' }));
      setValueSearch((prev) => ({
        ...prev,
        valueSearch: '',
        valueSearch1: '',
        valueSearch2: '',
        valueSearch3: '',
        valueSearch4: '',
      }));
    }
    await CategoryService.post({ name: e?.target?.value || e, parentId: null });
    const res = await CategoryService.get({ fullTextSearch: searchDebounce });
    setIdParent((prev) => ({ ...prev, mainParent: '', parent1: '', parent2: '', parent3: '', parent4: '' }));
    setDataCategory((prev) => ({
      ...prev,
      dataCategoryMain: res.data,
      dataCategory1: [],
      dataCategory2: [],
      dataCategory3: [],
      dataCategory4: [],
    }));
  };

  const handleAdd1 = async (e) => {
    typeof e !== 'string' && e.preventDefault();
    if (typeof e === 'string') {
      if (!e) return;
    } else {
      if (!e.target.value) {
        return;
      }
    }
    if (searchDebounce1) {
      setInputSearch((prev) => ({ ...prev, search1: '', search2: '', search3: '', search4: '' }));
      setValueSearch((prev) => ({ ...prev, valueSearch1: '', valueSearch2: '', valueSearch3: '', valueSearch4: '' }));
    }
    await CategoryService.post({ name: e?.target?.value || e, parentId: +idParent.mainParent });
    const res = await CategoryService.get({ id: idParent.mainParent, fullTextSearch: searchDebounce1 });
    setIdParent((prev) => ({ ...prev, parent1: '', parent2: '', parent3: '', parent4: '' }));
    setDataCategory((prev) => ({
      ...prev,
      dataCategory1: res.data,
      dataCategory2: [],
      dataCategory3: [],
      dataCategory4: [],
    }));
  };
  const handleAdd2 = async (e) => {
    typeof e !== 'string' && e.preventDefault();
    if (typeof e === 'string') {
      if (!e) return;
    } else {
      if (!e.target.value) {
        return;
      }
    }
    if (searchDebounce2) {
      setInputSearch((prev) => ({ ...prev, search2: '', search3: '', search4: '' }));
      setValueSearch((prev) => ({ ...prev, valueSearch2: '', valueSearch3: '', valueSearch4: '' }));
    }
    await CategoryService.post({ name: e?.target?.value || e, parentId: +idParent.parent1 });
    setIdParent((prev) => ({ ...prev, parent2: '', parent3: '', parent4: '' }));
    const res = await CategoryService.get({ id: idParent.parent1, fullTextSearch: searchDebounce3 });
    setDataCategory((prev) => ({
      ...prev,
      dataCategory2: res.data,
      dataCategory3: [],
      dataCategory4: [],
    }));
  };

  // const handleAdd3 = async (e) => {
  //   typeof e !== 'string' && e.preventDefault();
  //   if (typeof e === 'string') {
  //     if (!e) return;
  //   } else {
  //     if (!e.target.value) {
  //       return;
  //     }
  //   }
  //   if (searchDebounce3) {
  //     setInputSearch((prev) => ({ ...prev, search3: '', search4: '' }));
  //     setValueSearch((prev) => ({ ...prev, valueSearch3: '', valueSearch4: '' }));
  //   }
  //   await CategoryService.post({ name: e?.target?.value || e, parentId: +idParent.parent2 });
  //   setIdParent((prev) => ({ ...prev, parent3: '', parent4: '' }));
  //   const res = await CategoryService.get({ id: idParent.parent2, fullTextSearch: searchDebounce4 });
  //   setDataCategory((prev) => ({
  //     ...prev,
  //     dataCategory3: res.data,
  //     dataCategory4: [],
  //   }));
  // };

  // const handleAdd4 = async (e) => {
  //   typeof e !== 'string' && e.preventDefault();
  //   if (typeof e === 'string') {
  //     if (!e) return;
  //   } else {
  //     if (!e.target.value) {
  //       return;
  //     }
  //   }
  //   if (searchDebounce4) {
  //     setInputSearch((prev) => ({ ...prev, search4: '' }));
  //     setValueSearch((prev) => ({ ...prev, valueSearch4: '' }));
  //   }
  //   await CategoryService.post({ name: e?.target?.value || e, parentId: +idParent.parent3 });
  //   const res = await CategoryService.get({ id: idParent.parent3, fullTextSearch: searchDebounce4 });
  //   setDataCategory((prev) => ({
  //     ...prev,
  //     dataCategory4: res.data,
  //   }));
  // };

  const handleSave = async (row) => {
    if (row.name.trim().length === 0) {
      return false;
    }
    await CategoryService.put(row.name, idParent.mainParent);
    const res = await CategoryService.get({ fullTextSearch: searchDebounce });
    setDataCategory((prev) => ({
      ...prev,
      dataCategoryMain: res.data,
    }));
    document.querySelector(`.abc${row.id}`).classList.add('activeRow');
  };
  const handleSave1 = async (row) => {
    if (row.name.trim().length === 0) {
      return false;
    }
    await CategoryService.put(row.name, idParent.parent1);
    const res = await CategoryService.get({ id: idParent.mainParent, fullTextSearch: searchDebounce1 });
    setDataCategory((prev) => ({
      ...prev,
      dataCategory1: res.data,
    }));
    document.querySelector(`.abc${row.id}`).classList.add('activeRow');
  };

  const handleSave2 = async (row) => {
    if (row.name.trim().length === 0) {
      return false;
    }
    await CategoryService.put(row.name, idParent.parent2);
    const res = await CategoryService.get({ id: idParent.parent1, fullTextSearch: searchDebounce2 });
    setDataCategory((prev) => ({
      ...prev,
      dataCategory2: res.data,
    }));
    document.querySelector(`.abc${row.id}`).classList.add('activeRow');
  };

  // const handleSave3 = async (row) => {
  //   if (row.name.trim().length === 0) {
  //     return false;
  //   }
  //   await CategoryService.put(row.name, idParent.parent3);
  //   const res = await CategoryService.get({ id: idParent.parent2, fullTextSearch: searchDebounce3 });
  //   setDataCategory((prev) => ({
  //     ...prev,
  //     dataCategory3: res.data,
  //   }));
  //   document.querySelector(`.abc${row.id}`).classList.add('activeRow');
  // };

  // const handleSave4 = async (row) => {
  //   if (row.name.trim().length === 0) {
  //     return false;
  //   }
  //   await CategoryService.put(row.name, idParent.parent4);
  //   const res = await CategoryService.get({ id: idParent.parent3, fullTextSearch: searchDebounce4 });
  //   setDataCategory((prev) => ({
  //     ...prev,
  //     dataCategory4: res.data,
  //   }));
  //   document.querySelector(`.abc${row.id}`).classList.add('activeRow');
  // };

  const handleDelete = async (id) => {
    Message.confirm({
      text: 'Bạn có chắc chắn muốn xóa danh mục này? Khi thực hiện hành động xóa, danh mục sẽ bị xóa khỏi hệ thống và không hoàn tác được',
      onConfirm: async () => {
        await CategoryService.delete(id);
        // getDataCategoryAllLevelCheck();
        const res = await CategoryService.get({ fullTextSearch: searchDebounce });
        setDataCategory((prev) => ({
          ...prev,
          dataCategoryMain: res.data,
          dataCategory1: [],
          dataCategory2: [],
          dataCategory3: [],
          dataCategory4: [],
        }));
        setIdParent((prev) => ({ ...prev, mainParent: '', parent1: '', parent2: '', parent3: '', parent4: '' }));
      },
      title: 'Thông báo',
      cancelButtonText: 'Hủy',
      confirmButtonColor: '#DC2626',
      confirmButtonText: 'Xóa',
    });
  };
  const handleDelete1 = async (id) => {
    Message.confirm({
      text: 'Bạn có chắc chắn muốn xóa danh mục này? Khi thực hiện hành động xóa, danh mục sẽ bị xóa khỏi hệ thống và không hoàn tác được',
      onConfirm: async () => {
        await CategoryService.delete(id);
        // getDataCategoryAllLevelCheck();
        const res = await CategoryService.get({ id: idParent.mainParent, fullTextSearch: searchDebounce1 });
        setDataCategory((prev) => ({
          ...prev,
          dataCategory1: res.data,
          dataCategory2: [],
          dataCategory3: [],
          dataCategory4: [],
        }));
        setIdParent((prev) => ({ ...prev, parent1: '', parent2: '', parent3: '', parent4: '' }));
      },
      title: 'Thông báo',
      cancelButtonText: 'Hủy',
      confirmButtonColor: '#DC2626',
      confirmButtonText: 'Xóa',
    });
  };
  const handleDelete2 = async (id) => {
    Message.confirm({
      text: 'Bạn có chắc chắn muốn xóa danh mục này? Khi thực hiện hành động xóa, danh mục sẽ bị xóa khỏi hệ thống và không hoàn tác được',
      onConfirm: async () => {
        await CategoryService.delete(id);
        // getDataCategoryAllLevelCheck();
        const res = await CategoryService.get({ id: idParent.parent1, fullTextSearch: searchDebounce3 });
        setDataCategory((prev) => ({
          ...prev,
          dataCategory2: res.data,
          dataCategory3: [],
          dataCategory4: [],
        }));
        setIdParent((prev) => ({ ...prev, parent2: '', parent3: '', parent4: '' }));
      },
      title: 'Thông báo',
      cancelButtonText: 'Hủy',
      confirmButtonColor: '#DC2626',
      confirmButtonText: 'Xóa',
    });
  };
  // const handleDelete3 = async (id) => {
  //   Message.confirm({
  //     text: 'Bạn có chắc chắn muốn xóa danh mục này? Khi thực hiện hành động xóa, danh mục sẽ bị xóa khỏi hệ thống và không hoàn tác được',
  //     onConfirm: async () => {
  //       await CategoryService.delete(id);
  //       // getDataCategoryAllLevelCheck();
  //       const res = await CategoryService.get({ id: idParent.parent2, fullTextSearch: searchDebounce4 });
  //       setDataCategory((prev) => ({
  //         ...prev,
  //         dataCategory3: res.data,
  //         dataCategory4: [],
  //       }));
  //       setIdParent((prev) => ({ ...prev, parent3: '', parent4: '' }));
  //     },
  //     title: 'Thông báo',
  //     cancelButtonText: 'Hủy',
  //     confirmButtonColor: '#DC2626',
  //     confirmButtonText: 'Xóa',
  //   });
  // };
  // const handleDelete4 = async (id) => {
  //   Message.confirm({
  //     text: 'Bạn có chắc chắn muốn xóa danh mục này? Khi thực hiện hành động xóa, danh mục sẽ bị xóa khỏi hệ thống và không hoàn tác được',
  //     onConfirm: async () => {
  //       await CategoryService.delete(id);
  //       // getDataCategoryAllLevelCheck();
  //       const res = await CategoryService.get({ id: idParent.parent3, fullTextSearch: searchDebounce4 });
  //       setDataCategory((prev) => ({
  //         ...prev,
  //         dataCategory4: res.data,
  //       }));
  //       setIdParent((prev) => ({ ...prev, parent4: '' }));
  //     },
  //     title: 'Thông báo',
  //     cancelButtonText: 'Hủy',
  //     confirmButtonColor: '#DC2626',
  //     confirmButtonText: 'Xóa',
  //   });
  // };

  if (
    !dataCategory ||
    dataCategory.dataCategory1.length < 0 ||
    dataCategory.dataCategory2.length < 0 ||
    dataCategory.dataCategory3.length < 0 ||
    dataCategory.dataCategory4.length < 0 ||
    dataCategory.dataCategoryMain.length < 0
  ) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Spin className="w-[200px]" />
      </div>
    );
  }

  return (
    <Fragment>
      <div className="table-category min-h-screen">
        <p className="text-2xl font-bold text-teal-900 mb-3">Danh mục</p>
        <div className="bg-white pt-5 px-4 pb-5">
          <div className="overflow-x-auto">
            <div className="grid grid-cols-3 gap-4 overscroll-auto hover:overscroll-contain category w-[900px]">
              <div className="block-category">
                <CategoryAboveSection title="Danh mục chính" />
                <CategoryTable
                  valueSearch={valueSearch.valueSearch}
                  setValueSearch={setValueSearch}
                  className="mainCategory"
                  type="mainCategory"
                  dataSource={dataCategory.dataCategoryMain}
                  // setDataSource={setDataCategory}
                  loading={isLoad.loadingMain}
                  setIdParent={(id) => {
                    setIdParent((prev) => ({
                      ...prev,
                      mainParent: id,
                    }));
                  }}
                  handleSearch={(e) => {
                    setInputSearch((prev) => ({ ...prev, search: e.target.value }));
                    setValueSearch((prev) => ({ ...prev, valueSearch: e.target.value }));
                  }}
                  handleSave={handleSave}
                  handleDelete={handleDelete}
                  handleAdd={handleAdd}
                  idParent="none"
                  scrollRef={scrollRef}
                  isDisabled="none"
                  search={InputSeach.search}
                />
                <CategoryBellowSection />
              </div>
              <div className="block-category">
                <CategoryAboveSection title="Danh mục cấp 1" />
                <CategoryTable
                  type="category1"
                  valueSearch={valueSearch.valueSearch1}
                  dataSource={dataCategory.dataCategory1}
                  loading={isLoad.loading1}
                  setIdParent={(id) => {
                    setIdParent((prev) => ({
                      ...prev,
                      parent1: id,
                    }));
                  }}
                  idParent={idParent.mainParent}
                  handleSearch={(e) => {
                    setInputSearch((prev) => ({ ...prev, search1: e.target.value }));
                    setValueSearch((prev) => ({ ...prev, valueSearch1: e.target.value }));
                  }}
                  handleSave={handleSave1}
                  handleAdd={handleAdd1}
                  handleDelete={handleDelete1}
                  search={InputSeach.search1}
                />
                <CategoryBellowSection />
              </div>
              <div className="block-category">
                <CategoryAboveSection title="Danh mục cấp 2" />
                <CategoryTable
                  type="category2"
                  valueSearch={valueSearch.valueSearch2}
                  dataSource={dataCategory.dataCategory2}
                  loading={isLoad.loading2}
                  idParent={idParent.parent1}
                  setIdParent={(id) => {
                    setIdParent((prev) => ({ ...prev, parent2: id }));
                  }}
                  handleSearch={(e) => {
                    setInputSearch((prev) => ({ ...prev, search2: e.target.value }));
                    setValueSearch((prev) => ({ ...prev, valueSearch2: e.target.value }));
                  }}
                  search={InputSeach.search2}
                  handleSave={handleSave2}
                  handleAdd={handleAdd2}
                  handleDelete={handleDelete2}
                />
                <CategoryBellowSection />
              </div>
              {/* <div className="block-category">
                <CategoryAboveSection title="Danh mục cấp 3" />
                <CategoryTable
                  type="category3"
                  valueSearch={valueSearch.valueSearch3}
                  dataSource={dataCategory.dataCategory3}
                  loading={isLoad.loading3}
                  idParent={idParent.parent2}
                  setIdParent={(id) => {
                    setIdParent((prev) => ({ ...prev, parent3: id }));
                  }}
                  handleSearch={(e) => {
                    setInputSearch((prev) => ({ ...prev, search3: e.target.value }));
                    setValueSearch((prev) => ({ ...prev, valueSearch3: e.target.value }));
                  }}
                  handleSave={handleSave3}
                  handleAdd={handleAdd3}
                  handleDelete={handleDelete3}
                  search={InputSeach.search3}
                />
                <CategoryBellowSection />
              </div> */}
              {/* <div className="block-category">
                <CategoryAboveSection title="Danh mục cấp 4" />
                <CategoryTable
                  valueSearch={valueSearch.valueSearch4}
                  type="category4"
                  dataSource={dataCategory.dataCategory4}
                  idParent={idParent.parent3}
                  loading={isLoad.loading4}
                  handleSearch={(e) => {
                    setInputSearch((prev) => ({ ...prev, search4: e.target.value }));
                    setValueSearch((prev) => ({ ...prev, valueSearch4: e.target.value }));
                  }}
                  setIdParent={(id) => {
                    setIdParent((prev) => ({ ...prev, parent4: id }));
                  }}
                  handleSave={handleSave4}
                  handleAdd={handleAdd4}
                  handleDelete={handleDelete4}
                  search={InputSeach.search4}
                />
                <CategoryBellowSection />
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
export default Page;
