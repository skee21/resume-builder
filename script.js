document.addEventListener('DOMContentLoaded', () => {
    const formContainer = document.getElementById('resume-form-container');
    const previewContainer = document.getElementById('resume-preview-container');
    const exportPdfBtn = document.getElementById('export-pdf');
    const addSectionBtn = document.getElementById('add-section-btn');
    const resetDataBtn = document.getElementById('reset-data');
    const exportJsonBtn = document.getElementById('export-json');
    const importJsonInput = document.getElementById('import-json');

    const sectionTemplates = {
        personal: `
            <div class="border-b pb-6 draggable-section" draggable="true" data-section-id="personal">
                <div class="drag-handle">⠿</div>
                <h3 class="text-lg font-medium mb-4">Personal Information</h3>
                <div class="flex items-center gap-4 mb-4">
                    <img id="profile-image-preview" src="https://placehold.co/100x100/e2e8f0/e2e8f0" alt="Profile Preview">
                    <div class="w-full">
                        <label class="block text-sm font-medium text-gray-700">Profile Picture (Optional)</label>
                        <input type="file" id="profile-image" accept="image/*" class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100"/>
                    </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" id="name" placeholder="Full Name" class="p-3 border rounded-md w-full" required>
                    <input type="email" id="email" placeholder="Email Address" class="p-3 border rounded-md w-full" required>
                    <input type="tel" id="phone" placeholder="Phone Number" class="p-3 border rounded-md w-full">
                    <input type="text" id="linkedin" placeholder="LinkedIn Profile URL" class="p-3 border rounded-md w-full">
                </div>
                <textarea id="summary" placeholder="Professional Summary" class="p-3 border rounded-md w-full mt-4 h-24"></textarea>
            </div>
        `,
        experience: `
            <div class="border-b pb-6 draggable-section" draggable="true" data-section-id="experience">
                <div class="drag-handle">⠿</div>
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-medium">Work Experience</h3>
                    <button type="button" class="add-work-btn bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 transition-colors">Add</button>
                </div>
                <div class="work-experience-fields space-y-4"></div>
            </div>
        `,
        projects: `
            <div class="border-b pb-6 draggable-section" draggable="true" data-section-id="projects">
                <div class="drag-handle">⠿</div>
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-medium">Projects</h3>
                    <button type="button" class="add-project-btn bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 transition-colors">Add</button>
                </div>
                <div class="project-fields space-y-4"></div>
            </div>
        `,
        education: `
             <div class="border-b pb-6 draggable-section" draggable="true" data-section-id="education">
                <div class="drag-handle">⠿</div>
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-medium">Education</h3>
                    <button type="button" class="add-education-btn bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 transition-colors">Add</button>
                </div>
                <div class="education-fields space-y-4"></div>
            </div>
        `,
        skills: `
            <div class="draggable-section" draggable="true" data-section-id="skills">
                <div class="drag-handle">⠿</div>
                <h3 class="text-lg font-medium mb-4">Skills</h3>
                <input type="text" id="skills" placeholder="e.g., JavaScript, Python, Project Management" class="p-3 border rounded-md w-full">
                <p class="text-sm text-gray-500 mt-1">Separate skills with a comma.</p>
            </div>
        `
    };

    const createCustomSection = (id, title, content) => `
        <div class="border-b pb-6 draggable-section" draggable="true" data-section-id="${id}">
            <div class="drag-handle">⠿</div>
            <div class="flex justify-between items-center mb-4">
                <input type="text" class="custom-title-input text-lg font-medium border-b-2 w-full" value="${title}">
                <button type="button" class="remove-section-btn text-red-500 hover:text-red-700 ml-4 font-bold">X</button>
            </div>
            <textarea class="custom-content-textarea p-3 border rounded-md w-full h-24" placeholder="Enter your content here...">${content}</textarea>
        </div>
    `;

    const debounce = (func, delay) => {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    };
    
    const saveData = debounce(() => {
        const sections = [];
        formContainer.querySelectorAll('.draggable-section').forEach(section => {
            const id = section.dataset.sectionId;
            const sectionData = { id, type: 'standard' };

            if (id === 'personal') {
                sectionData.name = document.getElementById('name').value;
                sectionData.email = document.getElementById('email').value;
                sectionData.phone = document.getElementById('phone').value;
                sectionData.linkedin = document.getElementById('linkedin').value;
                sectionData.summary = document.getElementById('summary').value;
                sectionData.picture = document.getElementById('profile-image-preview').src;
            } else if (id === 'experience') {
                sectionData.items = Array.from(section.querySelectorAll('.work-item')).map(item => ({
                    title: item.querySelector('.work-title').value,
                    company: item.querySelector('.work-company').value,
                    start: item.querySelector('.work-start').value,
                    end: item.querySelector('.work-end').value,
                    desc: item.querySelector('.work-desc').value,
                }));
            } else if (id === 'projects') {
                sectionData.items = Array.from(section.querySelectorAll('.project-item')).map(item => ({
                    title: item.querySelector('.project-title').value,
                    link: item.querySelector('.project-link').value,
                    desc: item.querySelector('.project-desc').value,
                }));
            } else if (id === 'education') {
                sectionData.items = Array.from(section.querySelectorAll('.education-item')).map(item => ({
                    degree: item.querySelector('.edu-degree').value,
                    institution: item.querySelector('.edu-institution').value,
                    year: item.querySelector('.edu-year').value,
                }));
            } else if (id === 'skills') {
                sectionData.skills = document.getElementById('skills').value;
            } else if (id.startsWith('custom-')) {
                sectionData.type = 'custom';
                sectionData.title = section.querySelector('.custom-title-input').value;
                sectionData.content = section.querySelector('.custom-content-textarea').value;
            }
            sections.push(sectionData);
        });
        localStorage.setItem('resumeData', JSON.stringify({ sections }));
        console.log("Data saved.");
    }, 500);

    const loadData = () => {
        const data = JSON.parse(localStorage.getItem('resumeData'));
        const sections = data?.sections || [
            { id: 'personal', type: 'standard' },
            { id: 'experience', type: 'standard' },
            { id: 'projects', type: 'standard' },
            { id: 'education', type: 'standard' },
            { id: 'skills', type: 'standard' },
        ];

        formContainer.innerHTML = '';
        sections.forEach(sectionData => {
            if (sectionData.type === 'standard') {
                const sectionEl = document.createElement('div');
                sectionEl.innerHTML = sectionTemplates[sectionData.id];
                formContainer.appendChild(sectionEl.firstElementChild);

                if (sectionData.id === 'personal') {
                    document.getElementById('name').value = sectionData.name || '';
                    document.getElementById('email').value = sectionData.email || '';
                    document.getElementById('phone').value = sectionData.phone || '';
                    document.getElementById('linkedin').value = sectionData.linkedin || '';
                    document.getElementById('summary').value = sectionData.summary || '';
                    if (sectionData.picture && !sectionData.picture.includes('placehold.co')) {
                       document.getElementById('profile-image-preview').src = sectionData.picture;
                    }
                } else if (sectionData.id === 'experience') {
                    sectionData.items?.forEach(addWorkExperience);
                } else if (sectionData.id === 'projects') {
                    sectionData.items?.forEach(addProject);
                } else if (sectionData.id === 'education') {
                    sectionData.items?.forEach(addEducation);
                } else if (sectionData.id === 'skills') {
                     document.getElementById('skills').value = sectionData.skills || '';
                }

            } else if (sectionData.type === 'custom') {
                const customSectionHTML = createCustomSection(sectionData.id, sectionData.title, sectionData.content);
                formContainer.insertAdjacentHTML('beforeend', customSectionHTML);
            }
        });
        updatePreview();
    };

    const updatePreview = () => {
        let previewHTML = '';
        const sections = formContainer.querySelectorAll('.draggable-section');

        const personalData = Array.from(sections).find(s => s.dataset.sectionId === 'personal');
        if (personalData) {
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const linkedin = document.getElementById('linkedin').value;
            const pictureSrc = document.getElementById('profile-image-preview').src;
            
            let pictureHTML = '';
            if(pictureSrc && !pictureSrc.includes('placehold.co')){
                pictureHTML = `<img src="${pictureSrc}" alt="Profile" class="w-24 h-24 rounded-full mx-auto mb-4">`;
            }
            
            previewHTML += `
                <div class="text-center border-b pb-4 mb-6">
                    ${pictureHTML}
                    <h1 class="text-4xl font-bold">${name || 'Your Name'}</h1>
                    <div class="flex justify-center items-center flex-wrap gap-x-4 mt-2 text-gray-600">
                        <span>${email || 'your.email@example.com'}</span>
                        ${phone ? `<span>|</span><span>${phone}</span>` : ''}
                        ${linkedin ? `<span>|</span><a href="${linkedin}" class="text-indigo-600 hover:underline">${linkedin.replace(/^(https?:\/\/)?(www\.)?/, '')}</a>` : ''}
                    </div>
                </div>
            `;
        }

        sections.forEach(section => {
            const id = section.dataset.sectionId;
            if (id === 'personal') { 
                const summary = document.getElementById('summary').value;
                if(summary) {
                     previewHTML += `<div><h3 class="text-xl font-semibold border-b-2 border-indigo-500 pb-1 mb-3">Summary</h3><p class="text-gray-700">${summary}</p></div>`;
                }
            } else if (id === 'experience') {
                 let workHtml = Array.from(section.querySelectorAll('.work-item')).map(work => {
                    const title = work.querySelector('.work-title').value;
                    const company = work.querySelector('.work-company').value;
                    if (!title && !company) return '';
                    return `
                        <div class="mb-4">
                            <h4 class="font-semibold text-lg">${title}</h4>
                            <p class="text-md text-gray-700">${company}</p>
                            <p class="text-sm text-gray-500">${work.querySelector('.work-start').value} - ${work.querySelector('.work-end').value}</p>
                            <ul class="list-disc list-inside mt-1 text-gray-600">${work.querySelector('.work-desc').value.split('\n').map(item => `<li>${item}</li>`).join('')}</ul>
                        </div>`;
                }).join('');
                if(workHtml) previewHTML += `<div class="mt-6"><h3 class="text-xl font-semibold border-b-2 border-indigo-500 pb-1 mb-3">Work Experience</h3>${workHtml}</div>`;

            } else if (id === 'projects') {
                 let projectsHtml = Array.from(section.querySelectorAll('.project-item')).map(proj => {
                    const title = proj.querySelector('.project-title').value;
                    const link = proj.querySelector('.project-link').value;
                    const desc = proj.querySelector('.project-desc').value;
                    if (!title) return '';

                    const linkHtml = link ? `<a href="${link}" class="text-indigo-600 hover:underline ml-2" target="_blank">[Link]</a>` : '';

                    return `
                        <div class="mb-4">
                            <h4 class="font-semibold text-lg">${title}${linkHtml}</h4>
                            <ul class="list-disc list-inside mt-1 text-gray-600">${desc.split('\n').map(item => `<li>${item}</li>`).join('')}</ul>
                        </div>`;
                }).join('');
                if(projectsHtml) previewHTML += `<div class="mt-6"><h3 class="text-xl font-semibold border-b-2 border-indigo-500 pb-1 mb-3">Projects</h3>${projectsHtml}</div>`;
            
            } else if (id === 'education') {
                 let educationHtml = Array.from(section.querySelectorAll('.education-item')).map(edu => {
                    const degree = edu.querySelector('.edu-degree').value;
                    const institution = edu.querySelector('.edu-institution').value;
                    if (!degree && !institution) return '';
                    return `
                        <div class="mb-3">
                            <h4 class="font-semibold text-lg">${degree}</h4>
                            <p class="text-md text-gray-700">${institution}</p>
                            <p class="text-sm text-gray-500">Completed: ${edu.querySelector('.edu-year').value}</p>
                        </div>`;
                }).join('');
                 if(educationHtml) previewHTML += `<div class="mt-6"><h3 class="text-xl font-semibold border-b-2 border-indigo-500 pb-1 mb-3">Education</h3>${educationHtml}</div>`;

            } else if (id === 'skills') {
                const skills = document.getElementById('skills').value.split(',').map(s => s.trim()).filter(Boolean);
                if(skills.length > 0) {
                    const skillsHtml = skills.map(skill => `<span class="bg-indigo-100 text-indigo-800 text-sm font-medium mr-2 mb-2 px-2.5 py-0.5 rounded">${skill}</span>`).join('');
                    previewHTML += `<div class="mt-6"><h3 class="text-xl font-semibold border-b-2 border-indigo-500 pb-1 mb-3">Skills</h3><div class="flex flex-wrap mt-2">${skillsHtml}</div></div>`;
                }
            } else if (id.startsWith('custom-')) {
                const title = section.querySelector('.custom-title-input').value;
                const content = section.querySelector('.custom-content-textarea').value;
                if(title && content) {
                     previewHTML += `<div class="mt-6"><h3 class="text-xl font-semibold border-b-2 border-indigo-500 pb-1 mb-3">${title}</h3><p class="text-gray-700">${content.replace(/\n/g, '<br>')}</p></div>`;
                }
            }
        });
        previewContainer.innerHTML = previewHTML;
    };

    const addWorkExperience = (work = {}) => {
        const container = formContainer.querySelector('.work-experience-fields');
        const item = document.createElement('div');
        item.className = 'p-4 border rounded-md relative work-item';
        item.innerHTML = `
            <button type="button" class="absolute top-2 right-2 text-red-500 hover:text-red-700 remove-btn">&times;</button>
            <input type="text" placeholder="Job Title" class="p-2 border rounded-md w-full mb-2 work-title" value="${work.title || ''}">
            <input type="text" placeholder="Company" class="p-2 border rounded-md w-full mb-2 work-company" value="${work.company || ''}">
            <div class="grid grid-cols-2 gap-2 mb-2">
                <input type="text" placeholder="Start Date" class="p-2 border rounded-md w-full work-start" value="${work.start || ''}">
                <input type="text" placeholder="End Date" class="p-2 border rounded-md w-full work-end" value="${work.end || ''}">
            </div>
            <textarea placeholder="Responsibilities" class="p-2 border rounded-md w-full h-20 work-desc">${work.desc || ''}</textarea>`;
        container.appendChild(item);
    };

    const addProject = (project = {}) => {
        const container = formContainer.querySelector('.project-fields');
        if (!container) return;
        const item = document.createElement('div');
        item.className = 'p-4 border rounded-md relative project-item';
        item.innerHTML = `
            <button type="button" class="absolute top-2 right-2 text-red-500 hover:text-red-700 remove-btn">&times;</button>
            <input type="text" placeholder="Project Title" class="p-2 border rounded-md w-full mb-2 project-title" value="${project.title || ''}">
            <input type="text" placeholder="Project Link (e.g., GitHub, Live Demo)" class="p-2 border rounded-md w-full mb-2 project-link" value="${project.link || ''}">
            <textarea placeholder="Description & Technologies Used" class="p-2 border rounded-md w-full h-20 project-desc">${project.desc || ''}</textarea>`;
        container.appendChild(item);
    };

    const addEducation = (edu = {}) => {
        const container = formContainer.querySelector('.education-fields');
        const item = document.createElement('div');
        item.className = 'p-4 border rounded-md relative education-item';
        item.innerHTML = `
            <button type="button" class="absolute top-2 right-2 text-red-500 hover:text-red-700 remove-btn">&times;</button>
            <input type="text" placeholder="Degree" class="p-2 border rounded-md w-full mb-2 edu-degree" value="${edu.degree || ''}">
            <input type="text" placeholder="Institution" class="p-2 border rounded-md w-full mb-2 edu-institution" value="${edu.institution || ''}">
            <input type="text" placeholder="Year of Completion" class="p-2 border rounded-md w-full edu-year" value="${edu.year || ''}">`;
        container.appendChild(item);
    };
    
    formContainer.addEventListener('input', (e) => {
        if(e.target.id === 'profile-image'){
            const file = e.target.files[0];
            if(file){
                const reader = new FileReader();
                reader.onload = (event) => {
                    document.getElementById('profile-image-preview').src = event.target.result;
                    saveData();
                    updatePreview();
                };
                reader.readAsDataURL(file);
            }
            return;
        }
        saveData();
        updatePreview();
    });

    formContainer.addEventListener('click', (e) => {
        if(e.target.classList.contains('add-work-btn')) {
            addWorkExperience();
        } else if (e.target.classList.contains('add-project-btn')) {
            addProject();
        } else if (e.target.classList.contains('add-education-btn')) {
            addEducation();
        } else if (e.target.classList.contains('remove-btn')) {
            e.target.parentElement.remove();
            saveData();
            updatePreview();
        } else if (e.target.classList.contains('remove-section-btn')) {
            e.target.closest('.draggable-section').remove();
            saveData();
            updatePreview();
        }
    });
    
    let draggedItem = null;
    formContainer.addEventListener('dragstart', (e) => {
        if (e.target.classList.contains('draggable-section')) {
            draggedItem = e.target;
            setTimeout(() => e.target.classList.add('dragging'), 0);
        }
    });

    formContainer.addEventListener('dragend', (e) => {
        if(draggedItem) {
            setTimeout(() => {
                draggedItem.classList.remove('dragging');
                draggedItem = null;
                saveData();
                updatePreview();
            }, 0);
        }
    });

    formContainer.addEventListener('dragover', (e) => {
        e.preventDefault();
        const afterElement = getDragAfterElement(formContainer, e.clientY);
        if (afterElement == null) {
            formContainer.appendChild(draggedItem);
        } else {
            formContainer.insertBefore(draggedItem, afterElement);
        }
    });
    
    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.draggable-section:not(.dragging)')];
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    addSectionBtn.addEventListener('click', () => {
        const title = prompt("Enter a title for your new section:", "Projects");
        if (title) {
            const id = `custom-${Date.now()}`;
            const customSectionHTML = createCustomSection(id, title, '');
            formContainer.insertAdjacentHTML('beforeend', customSectionHTML);
            saveData();
        }
    });
    
    resetDataBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
            localStorage.removeItem('resumeData');
            loadData();
        }
    });

    exportPdfBtn.addEventListener('click', () => {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({ orientation: 'p', unit: 'pt', format: 'a4' });

        const margin = { top: 40, right: 40, bottom: 40, left: 40 };
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const contentWidth = pageWidth - margin.left - margin.right;
        let y = margin.top;
        const lineHeight = 1.2;

        const checkPageBreak = (height) => {
            if (y + height > pageHeight - margin.bottom) {
                pdf.addPage();
                y = margin.top;
            }
        };

        const sections = formContainer.querySelectorAll('.draggable-section');

        const personalSection = Array.from(sections).find(s => s.dataset.sectionId === 'personal');
        if (personalSection) {
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const linkedin = document.getElementById('linkedin').value;
            const pictureImg = document.getElementById('profile-image-preview');

            if (pictureImg.src && !pictureImg.src.includes('placehold.co')) {
                try {
                    pdf.addImage(pictureImg.src, 'PNG', pageWidth - margin.right - 70, y, 70, 70);
                } catch (e) {
                    console.error("Error adding profile image to PDF:", e);
                }
            }

            pdf.setFont('helvetica', 'bold');
            pdf.setFontSize(24);
            pdf.text(name, margin.left, y + 20);
            y += 30;

            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(10);
            let contactInfo = [email, phone, linkedin].filter(Boolean).join(' | ');
            if (contactInfo) {
                pdf.text(contactInfo, margin.left, y);
                y += 20;
            }

            pdf.setDrawColor(200, 200, 200);
            pdf.line(margin.left, y, pageWidth - margin.right, y);
            y += 20;
        }

        sections.forEach(section => {
            const id = section.dataset.sectionId;

            const renderSectionHeader = (title) => {
                checkPageBreak(40);
                pdf.setFont('helvetica', 'bold');
                pdf.setFontSize(14);
                pdf.text(title, margin.left, y);
                y += 10;
                pdf.setDrawColor(150, 150, 150);
                pdf.line(margin.left, y, pageWidth - margin.right, y);
                y += 20;
            };

            const renderListItem = (title, subtitle, dates, description) => {
                checkPageBreak(30);
                pdf.setFont('helvetica', 'bold');
                pdf.setFontSize(11);
                pdf.text(title, margin.left, y);

                if (dates) {
                    pdf.setFont('helvetica', 'normal');
                    pdf.text(dates, pageWidth - margin.right, y, { align: 'right' });
                }
                y += 15;

                if (subtitle) {
                    checkPageBreak(15);
                    pdf.setFont('helvetica', 'italic');
                    pdf.setFontSize(10);
                    pdf.text(subtitle, margin.left, y);
                    y += 15;
                }

                if (description) {
                    pdf.setFont('helvetica', 'normal');
                    pdf.setFontSize(10);
                    const descLines = pdf.splitTextToSize(description.replace(/\n/g, ' '), contentWidth);
                    const descHeight = descLines.length * 10 * lineHeight;
                    checkPageBreak(descHeight);
                    pdf.text(descLines, margin.left, y);
                    y += descHeight;
                }
                y += 15;
            };

            if (id === 'personal') {
                const summary = document.getElementById('summary').value;
                if (summary) {
                    renderSectionHeader('Summary');
                    pdf.setFont('helvetica', 'normal');
                    pdf.setFontSize(10);
                    const lines = pdf.splitTextToSize(summary, contentWidth);
                    const textHeight = lines.length * 10 * lineHeight;
                    checkPageBreak(textHeight);
                    pdf.text(lines, margin.left, y);
                    y += textHeight + 10;
                }
            } else if (id === 'experience') {
                const items = Array.from(section.querySelectorAll('.work-item'));
                if (items.some(i => i.querySelector('.work-title').value)) {
                    renderSectionHeader('Work Experience');
                    items.forEach(item => {
                        const title = item.querySelector('.work-title').value;
                        if (!title) return;
                        renderListItem(
                            title,
                            item.querySelector('.work-company').value,
                            `${item.querySelector('.work-start').value} - ${item.querySelector('.work-end').value}`,
                            item.querySelector('.work-desc').value
                        );
                    });
                }
            } else if (id === 'projects') {
                const items = Array.from(section.querySelectorAll('.project-item'));
                if (items.some(i => i.querySelector('.project-title').value)) {
                    renderSectionHeader('Projects');
                    items.forEach(item => {
                        const title = item.querySelector('.project-title').value;
                        if (!title) return;
                        const link = item.querySelector('.project-link').value;
                        let fullTitle = title;
                        if(link) {
                           pdf.setTextColor(0,0,255);
                           fullTitle += ` [link]`;
                        }

                        renderListItem(
                            fullTitle,
                            null,
                            null,
                            item.querySelector('.project-desc').value
                        );
                        pdf.setTextColor(0,0,0);
                    });
                }
            } else if (id === 'education') {
                const items = Array.from(section.querySelectorAll('.education-item'));
                if (items.some(i => i.querySelector('.edu-degree').value)) {
                    renderSectionHeader('Education');
                    items.forEach(item => {
                        const degree = item.querySelector('.edu-degree').value;
                        if (!degree) return;
                        renderListItem(
                            degree,
                            item.querySelector('.edu-institution').value,
                            item.querySelector('.edu-year').value,
                            null
                        );
                    });
                }
            } else if (id === 'skills') {
                const skills = document.getElementById('skills').value;
                if (skills) {
                    renderSectionHeader('Skills');
                    pdf.setFont('helvetica', 'normal');
                    pdf.setFontSize(10);
                    const lines = pdf.splitTextToSize(skills, contentWidth);
                    const textHeight = lines.length * 10 * lineHeight;
                    checkPageBreak(textHeight);
                    pdf.text(lines, margin.left, y);
                    y += textHeight + 10;
                }
            } else if (id.startsWith('custom-')) {
                const title = section.querySelector('.custom-title-input').value;
                const content = section.querySelector('.custom-content-textarea').value;
                if (title && content) {
                    renderSectionHeader(title);
                    pdf.setFont('helvetica', 'normal');
                    pdf.setFontSize(10);
                    const lines = pdf.splitTextToSize(content, contentWidth);
                    const textHeight = lines.length * 10 * lineHeight;
                    checkPageBreak(textHeight);
                    pdf.text(lines, margin.left, y);
                    y += textHeight + 10;
                }
            }
        });

        pdf.save('resume.pdf');
    });

    exportJsonBtn.addEventListener('click', () => {
        const resumeData = localStorage.getItem('resumeData');
        if (!resumeData) {
            console.error("No resume data to export.");
            return;
        }
        const blob = new Blob([resumeData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'resume-config.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    importJsonInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (!file) {
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target.result);
                // Basic validation
                if (importedData && Array.isArray(importedData.sections)) {
                    localStorage.setItem('resumeData', JSON.stringify(importedData));
                    loadData(); // Reload the UI with the new data
                } else {
                    throw new Error("Invalid JSON format: 'sections' array not found.");
                }
            } catch (error) {
                console.error("Invalid Json file", error);
            }
        };
        reader.readAsText(file);
        
        // Reset the input so the user can import the same file again if needed
        event.target.value = null;
    });

    loadData();
});


