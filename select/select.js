const allSelect = document.querySelectorAll('.select__');

allSelect.forEach(select => {
    let selectTag = select.querySelector('select');
    let selectTagOptions = selectTag.children;
    let selectTagOptionsLength = selectTag.children.length;
    let selectedIndex = selectTag.selectedIndex;
    let disabledIndex = [];

    /* Creating Header Elements */
    let selectHeaderEl = document.createElement('div');
    let selectValueEl = document.createElement('p');
    let selectDropdownEl = document.createElement('div');
    /* Creating Body Elements */
    let selectBodyEl = document.createElement('div');
    let searchCont = document.createElement('div')
    let searchEl = document.createElement('div');
    let listEl = document.createElement('div');

    selectHeaderEl.classList.add('select__inner__header__');
    selectValueEl.classList.add('value');
    selectBodyEl.classList.add('select__inner__body__');
    listEl.classList.add('list');
    searchCont.classList.add('search-cont')

    selectHeaderEl.appendChild(selectValueEl);
    if(select.querySelector('.icon')) {
        selectDropdownEl.classList.add('dropdown')
        selectDropdownEl.appendChild(select.querySelector('.icon'));
        selectHeaderEl.appendChild(selectDropdownEl);
    }
    selectTag.style.display = 'block'
    selectTag.style.position = 'absolute'
    selectTag.style.opacity = '0'
    selectTag.style.zIndex = '-9999'
    if(select.querySelector('.search__input')) {
        let search = select.querySelector('.search__input')
        let searchList = select
        searchEl.classList.add('search')    
        searchEl.appendChild(select.querySelector('.search__input'));
        searchCont.appendChild(searchEl)
        selectBodyEl.appendChild(searchCont);
    }else {
        selectTag.addEventListener('change', ()=> {
            let selectedIndex = selectTag.selectedIndex;
            let optionsList =select.querySelector('.select__inner__body__ .list');
            let allOption = select.querySelectorAll('.select__inner__body__ .list .item');
            allOption.forEach(opt => {
                opt.classList.remove('selected');
            })
            optionsList.children[selectedIndex].classList.add('selected');
            selectValueEl.textContent = optionsList.children[selectedIndex].textContent

            let scrollTop = optionsList.children[0].getBoundingClientRect().height * selectTag.selectedIndex
            setTimeout(()=> {
                selectBodyEl.querySelector('.list').scrollTo(0, scrollTop)
            },15)
        })  
    }
    selectBodyEl.style.display = 'none'

    selectValueEl.textContent = selectTagOptions[selectedIndex].textContent

    Object.entries(selectTagOptions).forEach((opt, i)=> {
        let item = document.createElement('div')
        item.classList.add('item')
        if(opt[1].disabled) {
            item.classList.add('disabled')
        }
        if(opt[1].selected) {
            item.classList.add('selected')
        }
        item.textContent = opt[1].textContent
        listEl.appendChild(item)
    }) 

    selectBodyEl.appendChild(listEl);
    select.appendChild(selectHeaderEl);
    select.appendChild(selectBodyEl);
    
    //Common functions
    if(select.querySelector('.search__input')) {
        let currentList = select.querySelectorAll('.item')
        currentList.forEach((opt, i) => {
            opt.classList.add('searched')
        })

        select.querySelector('.search__input').addEventListener('input', (e)=> {
            const filter = e.target.value.toLowerCase()
            currentList.forEach((item,i) => {
                if(filter === "") {
                    item.classList.remove('target')
                    item.style.display = 'flex'
                    item.classList.add('searched')
                    if(item.classList.contains('selected')) {
                        count = i
                    }
                }else {
                    if(item.textContent.toLocaleLowerCase().includes(filter.toLocaleLowerCase())) {
                        item.style.display = 'flex'
                        item.classList.remove('target')
                        item.classList.add('searched')
                        let newCurrentList = select.querySelectorAll('.item.searched')
                        newCurrentList[0].classList.add('target')
                        count = 0
                        if(item.classList.contains('target')) {
                            target = i
                        }
                        
                    }else {
                        item.style.display = 'none'
                        item.classList.remove('searched')
                    }                }
            })
        })
    }

    select.addEventListener('click', listesFunc)
    function listesFunc() {
        allSelect.forEach(sc => {
            if(!select.classList.contains('active') && select !== sc) {
                let currentList = sc.querySelector('.select__inner__body__')
                currentList.style.display = 'none'

                if(!sc.querySelector('.search__input')) {
                    let scSelectTag = sc.querySelector('select')
                    scSelectTag.blur()
                    scSelectTag.size = 0
                }
                sc.classList.remove('active')
            }
        })
        if(select.classList.contains('active')) {
            undropList()

        }else if(!select.classList.contains('active')) {
            dropList()
        }
        if(select.querySelector('.search__input')){
            select.querySelector('.search__input').value = ''
        }
    }
    function dropList() {
        let selectList = select.querySelector('.list')
        let allOptions = select.querySelectorAll('.item')

        if(!select.querySelector('.search__input')) {
            selectTag.focus()
            selectTag.size = selectTagOptionsLength
        
        }else if(select.querySelector('.search__input')){
            setTimeout(()=> {
                select.querySelector('.search__input').focus()
            }, 10)

        }

        allOptions.forEach(opt => {
            opt.classList.remove('target')
        })
        count = selectTag.selectedIndex
        selectBodyEl.style.display = 'flex';
        select.classList.add('active')

        let scrollTop = selectList.children[0].getBoundingClientRect().height * selectTag.selectedIndex
        setTimeout(()=> {
            selectBodyEl.querySelector('.list').scrollTo(0, scrollTop)
        },15)


    }
    function undropList(){
        if(!select.querySelector('.search__input')) {
            selectTag.blur()
            selectTag.size = 0
        }
        selectBodyEl.style.display = 'none'
        select.classList.remove('active')
        count = selectTag.selectedIndex
        if(select.querySelector('.search__input')) {
            select.querySelectorAll('.item').forEach(item => {
                item.classList.remove('target')
                item.classList.add('searched')
                item.style.display = 'flex'
            })
        }
    }
    let count = selectTag.selectedIndex
    let target = 0;
    select.addEventListener('keydown', (e)=> {
        if(e.key === "Enter") {
            undropList()
        }

        if(select.querySelector('.search__input')) {
            if(e.key === "Enter") {
                e.preventDefault()
                let selectList = select.querySelector('.list')
                
                let allOptions = select.querySelectorAll('.item')
                allOptions.forEach(opt => {
                    opt.classList.remove('selected')
                })
                selectList.children[target].classList.add('selected')
                selectValueEl.textContent = selectList.children[target].textContent
                selectTag.children[target].selected = true
                count = target
            }
            if(e.key === "ArrowUp") {
                let allOpts = select.querySelectorAll('.item')
                let allOptions = select.querySelectorAll('.item.searched')
                do {
                    if(count !== 0) {
                        --count
                        if(!allOptions[count].classList.contains('disabled')) {
                            allOptions.forEach(opt => {
                                opt.classList.remove('target')
                            })
                            allOptions[count].classList.add('target')
                        }
                        let scrollTop = allOptions[0].getBoundingClientRect().height * count
                        setTimeout(()=> {
                            selectBodyEl.querySelector('.list').scrollTo(0, scrollTop)
                        },15)
                    }
                } while(allOptions[count].classList.contains('disabled'))
                allOpts.forEach((opt, i) => {
                    if(opt.classList.contains('target')) {
                        target = i
                        console.log(target)
                    }
                })
            }
            if(e.key === "ArrowDown") {
                let allOpts = select.querySelectorAll('.item')
                let allOptions = select.querySelectorAll('.item.searched')
                do {
                    if(count <= allOptions.length - selectedIndex - 2) {
                        ++count
                        if(!allOptions[count].classList.contains('disabled')) {
                            allOptions.forEach(opt => {
                                opt.classList.remove('target')
                            })
                            allOptions[count].classList.add('target')
                        }
                        
                        let scroller = allOptions[0].getBoundingClientRect().height * count
                        setTimeout(()=> {
                            selectBodyEl.querySelector('.list').scrollTo(0, scroller)
                        },15)
                    }
                } while(allOptions[count].classList.contains('disabled'))
                allOpts.forEach((opt, i) => {
                    if(opt.classList.contains('target')) {
                        target = i
                    }
                })


            }
            if(e.key !== "ArrowUp" && e.key !== "ArrowDown") {
                selectBodyEl.querySelector('.list').scrollTo(0, 0)
            }

        }
    })
    
    selectTag.addEventListener('focus', listesFunc)    

    document.addEventListener('click', (e)=> {
        if(!e.target.closest('.select__')) {
            if(select.classList.contains('active')) {
                undropList()
            }
        }
    })
    let allOptions = select.querySelectorAll('.select__inner__body__ .item')
    allOptions.forEach((item, i) => {
        item.addEventListener('click', ()=>{
            allOptions.forEach(opt => {
                opt.classList.remove('selected')
            })
            selectValueEl.textContent = item.textContent
            selectTag.children[i].selected = true
            item.classList.add('selected')
        })
    })

})