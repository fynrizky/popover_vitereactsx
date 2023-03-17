import React, { useState, useRef, useEffect } from 'react'

interface Todo {
  id: number;
  name: string;
  type: string;
  desc: string;
  card_images: cardImages[]
}

interface cardImages {
  id: number;
  image_url: string;
  image_url_small: string;
}

interface Props {
  todos?: Todo[];
}

const PageMenu = ({ todos }: Props) => {
  const [lazyLoad, setLazyLoad] = useState<boolean>(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [selectedTodoIndex, setSelectedTodoIndex] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [cardTransition, setCardTransition] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(()=> {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setSelectedTodoIndex(0);
        setSelectedTodo(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setSelectedTodo, setSelectedTodoIndex])

    const handleCloseClick = () => {
      setSelectedTodo(null);
      setSelectedTodoIndex(0);
    };


  const handleTodoClick = (todo: Todo) => {
    setSelectedTodo(todo);
    setSelectedTodoIndex(0);
    setCardTransition(false);
    setTimeout(()=> {
      setCardTransition(true);
    },500)
  }

  const handleNextClick = () => {
    // data array (4 data) => [1,2,3,4] - 1 = //[0,1,2,3] => data array length
    if (selectedTodo && selectedTodoIndex < selectedTodo.card_images.length - 1) {
      // set selectedTodo = 0 < Data Array length => selectedTodoIndex +1 every handlenextClick clicked
      setSelectedTodoIndex(selectedTodoIndex + 1);
    }
  }

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // cara2
    setSearchTerm(event.currentTarget.searchTerm.value);
    setCurrentPage(1);
    setLazyLoad(true);
    setTimeout(() => {
      setLazyLoad(false);
    }, 1000);
  };


  const filteredData = todos && todos.filter((item) => {
    return item.name.toLowerCase().includes(searchTerm.toLocaleLowerCase()) ||
           item.type.toLowerCase().includes(searchTerm.toLocaleLowerCase()) ||
           item.desc.toLowerCase().includes(searchTerm.toLocaleLowerCase()) 
  })
  
  const handlePrevClick = () => {
    if (selectedTodo && selectedTodoIndex > 0) {
      setSelectedTodoIndex(selectedTodoIndex - 1);
    }
  }

 
  const cardsPerPage: number = 12;
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  // console.log(indexOfFirstCard);
  const currentCards = filteredData && filteredData.slice(indexOfFirstCard, indexOfLastCard);
  //sort atau urutkan
  currentCards?.sort((a, b) => {
    if (a.type < b.type) return -1;
    if (a.type > b.type) return 1;
    return 0;
  });
  // Mengurutkan data berdasarkan nilai properti "type"
  const dataCards = currentCards?.map(card => card.type);
  // console.log(dataCards)
  
  // penggunaan tanda seru (!) menandakan bahwa nilai tersebut adlah optional, 
  // tapi kita yakin nilai tersebut tidak undefined 
  // dan memberi tahu typescript bahwa nilai tersebut pasti akan ada
  // artinya nilai tersebut bisa bernilai number | undefined
  // nilainya bergantung pada filteredData
  const totalPages: number | undefined = filteredData && Math.ceil(filteredData.length / cardsPerPage);

 
  const getPageNumbers = () => {
    const maxPageNumbers = 3;
    const pageNumbers: number[] = [];
    let startPage = 1;
    // sama halnya dengan endPage yang diberikan type data number | undefined
    // jika halaman terakhir tidak ditentukan  maka nilainya undefined
    // karna sudah yakin nilai tersebut ada maka kita berikan tanda seru ! (endPage!)
    let endPage: number | undefined = totalPages;
  
    if (totalPages && totalPages > maxPageNumbers) {
      const middlePage = Math.ceil(maxPageNumbers / 2);
      if (currentPage > middlePage) {
        startPage = currentPage - (middlePage - 1);
        endPage = currentPage + (maxPageNumbers - middlePage);
        if (endPage > totalPages) {
          endPage = totalPages;
          startPage = totalPages - maxPageNumbers + 1;
        }
      } else {
        endPage = maxPageNumbers;
      } 
    }
  
    for (let i = startPage; i <= endPage!; i++) {
      pageNumbers.push(i);
    }
  
    return pageNumbers;
  };

  
     // Pagination
     const handleCLickPage = (pageNumber: number) =>{
      setCurrentPage(pageNumber)
      setLazyLoad(true);
      setTimeout(()=>{
        setLazyLoad(false);
      },1000)
  }

  const handlePrevPageClick = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      setLazyLoad(true);
      setTimeout(()=>{
        setLazyLoad(false);
      },1000)
    }
  };
  
  const handleNextPageClick = () => {
    if (currentPage < totalPages!) {
      setCurrentPage(currentPage + 1);
      setLazyLoad(true);
      setTimeout(()=>{
        setLazyLoad(false);
      },1000)
    }
  };

  const handleFirstPageClick = () => {
    setCurrentPage(1);
    setLazyLoad(true);
    setTimeout(() => {
      setLazyLoad(false);
    }, 1000);
  };
  
  const handleLastPageClick = () => {
    setCurrentPage(totalPages!);
    setLazyLoad(true);
    setTimeout(() => {
      setLazyLoad(false);
    }, 1000);
  };

  if (!todos) {
    return <div>No todos found</div>;
  }

  return (
    <div>
      <div style={{padding:"12px", filter: selectedTodo ? "blur(8px)" : ""}}>
          <h1>Yugioh Cards</h1>
      </div>
      <form onChange={(event) => handleSearch(event)} style={{display: 'flex', margin: '14px',filter: selectedTodo ? "blur(8px)" : "",
      }} className="flex my-4 w-full">
        <input type="text" id="searchTerm" 
        className='border border-grey-300 rounded bg-gray-900 text-slate-300 py-2 px-2 mr-2 flex-grow'  
        style={{border:'6px', borderRadius: '8px', background: 'rgb(200,200,200,0.2)', color: '#111', 
        padding: '8px', marginRight:'2px', width: '100vh'}}
        placeholder="Search Card..." 
        autoComplete='off' />
        {/* <button type="submit" 
        className='bg-gray-500 hover:bg-gray-600 text-slate-300 font-bold py-2 px-4 rounded'
        style={{backgroundColor: 'grey', fontSize: 'bold', padding: '4px', borderRadius: '8px'}}>Search</button> */}
      </form>
      
    <div style={{
      position:'relative', 
      paddingLeft:'20px', 
      paddingRight:'20px',
      justifyContent: 'center', 
      marginTop: '-14px', 
      filter: selectedTodo ? "blur(8px)" : "",
    }}>
      {searchTerm && dataCards && filteredData && filteredData.length > 0  && (
        <>
          <div style={{fontSize: '20px', fontWeight: 'bold', 
              position:'absolute', 
              color:'white',
              top: "42%",
              left: "50%",
              transform:  `translate(-50%, -50%)`,
              zIndex: lazyLoad ? '9999' : '-9999',
              }}>
                <p>Loading... </p>
            </div>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)", // divide into 3 columns
            gap: "2px",
            position:"relative",
            // zIndex: '-9999',
            padding: "4px",
            backgroundColor: 'rgb(100, 100, 100, 0.2)',
            borderBottomStyle: 'ridge',
            borderRightStyle: 'ridge',
            borderLeftStyle: 'ridge',
            borderTopStyle: 'none',
            overflow: "auto",
        
            }}>
          
              {currentCards && currentCards.map((todo, i) => (
              <>
                <div key={todo.id} style={{cursor:"pointer", display:'flex', 
                justifyContent:'center', alignItems:'center',
                filter: lazyLoad ? "blur(8px)" : "",}} onClick={() => handleTodoClick(todo)}>
                  <div >
                      <img width="70px" src={todo.card_images[0].image_url_small} alt="" />
                  </div>
                </div>  
              </>
              ))}
              
          </div>
          <div style={{display:'flex', justifyContent: 'space-between', paddingTop: '2px'}}>
                  {filteredData && filteredData.length > cardsPerPage && (
                    <div>
                    <button
                      className={``}
                      style={{marginRight: '2px', padding: '6px',
                      display: currentPage === 1 ? 'none': ''}}
                      onClick={handleFirstPageClick}>
                      &laquo;
                    </button>
                    <button
                     className={``}
                     style={{marginRight: '2px',
                            padding: '6px', 
                            display: currentPage === 1 ? 'none': ''}}
                     onClick={handlePrevPageClick}
                     disabled={currentPage === 1}
                   >
                     Prev
                   </button>
                    {getPageNumbers().map(pageNumber => {
                      return(
                        <button
                          key={pageNumber}
                          style={{
                            pointerEvents: currentPage === pageNumber ? 'none':'fill',
                            opacity: currentPage === pageNumber ? '0.5':'',
                            marginLeft: '2px', 
                            marginRight:'2px', 
                            padding: '6px',
                            borderRadius: 'rounded'}}
                          onClick={() => handleCLickPage(pageNumber)}
                        >
                          {pageNumber}
                        </button>
                    
                      )
                    })}
                    <button
                        className={``}
                        style={{marginLeft: '2px',
                                padding: '6px', 
                                display: currentPage >= totalPages! ? 'none': ''}}
                        onClick={handleNextPageClick}
                        disabled={currentPage >= totalPages!  }>
                        Next
                    </button>
                    <button
                      className={``}
                      style={{marginLeft: '2px', padding: '6px',
                      display: currentPage >= totalPages! ? 'none': ''}}
                      onClick={handleLastPageClick}>
                      &raquo;
                    </button>
                  </div>
                  )}
                  <p style={{}}>{filteredData!.length} Cards</p>
                </div>
        </>
    )}
    </div>  
      {selectedTodo && (
        <div style={{
            position: "absolute",
                top: "0",
                left: "0",
                bottom: "0",
                right: "0",
                backgroundColor: "rgba(0,0,0,0.5)",
        }}>
            <div  style={{
                position: "fixed",
                top: "50%",
                left: "50%",
            }}
            ref={ref}>
            <div style={{position: "absolute",
              top: "50%",
              left: "50%",
              padding: "14px",
              transform:  `translate(-50%, ${cardTransition ? "-50%" : "-180%"})`,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgb(999,999,999,0.5)",
              transition: "opacity 1.2s ease-in-out, transform 0.8s ease-in-out",
              borderRadius: "10px",
              opacity: cardTransition ? '1' : '0'
              // height: selectedTodo.card_images.length > 1 ? "50vh" : "",
              // overflow: selectedTodo.card_images.length > 1 ? "auto" : "",
            }}>
              <div style={{display: "flex", justifyContent: "space-between", marginTop: '-8px', marginBottom: "8px"}}>
                <div></div>
                <button style={{backgroundColor: "transparent", 
                border: "none", cursor: "pointer", fontSize: "24px"}} onClick={handleCloseClick}>×</button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "left" }}>
                <h2 style={{margin: 0}}>{selectedTodo.name}</h2>
                <div style={{ display: "flex", alignItems: "center", marginTop:'14px' }}>
                  {selectedTodo.card_images.length > 1 && (
                    <button 
                      style={{
                        padding: '8px', 
                        border: 'none', 
                        backgroundColor: selectedTodoIndex === 0 ? 
                        'rgb(910,910,910,0.1)' :
                        'rgb(900,900,900,0.3)',  
                        color:'white',
                        fontSize:'24px', 
                        borderRadius: '5px', 
                        cursor:'pointer',
                        margin: '5px'
                      }}
                      onClick={handlePrevClick} 
                      disabled={selectedTodoIndex === 0}
                    >
                      &laquo;
                    </button>
                  )}
                  {selectedTodo.card_images[selectedTodoIndex] && (
                    <img src={selectedTodo.card_images[selectedTodoIndex].image_url} 
                    width="240px" alt="" />
                  )}
                  {selectedTodo.card_images.length > 1 && (
                    <button 
                      style={{
                        padding: '10px', 
                        border: 'none', 
                        backgroundColor: selectedTodoIndex === selectedTodo.card_images.length - 1 ? 'rgb(910,910,910,0.1)' : 
                        'rgb(900,900,900,0.3)', 
                        color:'white',
                        fontSize:'24px', 
                        borderRadius: '5px', 
                        cursor:'pointer',
                        margin: '5px'
                      }}
                      onClick={handleNextClick} 
                      disabled={selectedTodoIndex === selectedTodo.card_images.length - 1}
                    >
                      &raquo;
                    </button>
                  )}
                </div>
              </div>
            </div>
            
            </div>
        </div>
      )}
    </div>
  )
}

export default PageMenu;

