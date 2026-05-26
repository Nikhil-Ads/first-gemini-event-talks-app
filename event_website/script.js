document.addEventListener('DOMContentLoaded', () => {
    const scheduleContainer = document.getElementById('schedule-container');
    const categorySearchInput = document.getElementById('category-search');

    function renderSchedule(scheduleItems, searchTerm = '') {
        scheduleContainer.innerHTML = ''; // Clear existing schedule

        const filteredTalks = allTalksData.filter(talk =>
            talk.categories.some(cat => cat.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        const filteredTalkTitles = new Set(filteredTalks.map(talk => talk.title));

        scheduleItems.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('schedule-item');

            let isHighlighted = false;
            if (searchTerm && item.type === 'talk' && filteredTalkTitles.has(item.title)) {
                itemElement.classList.add('highlight');
                isHighlighted = true;
            } else if (searchTerm && item.type === 'talk' && !filteredTalkTitles.has(item.title)) {
                // If a search term is active and this talk doesn't match, don't display it
                return;
            }


            if (item.type === 'talk') {
                itemElement.innerHTML = `
                    <div class="time-slot">
                        ${item.startTime}<br> - <br>${item.endTime}
                    </div>
                    <div class="talk-details">
                        <h3>${item.title}</h3>
                        <p class="speakers">Speaker(s): ${item.speakers.join(', ')}</p>
                        <div class="categories">
                            ${item.categories.map(cat => `<span>${cat}</span>`).join('')}
                        </div>
                        <p class="description">${item.description}</p>
                    </div>
                `;
            } else if (item.type === 'break') {
                itemElement.classList.add('break');
                itemElement.innerHTML = `
                    <div class="time-slot">
                        ${item.startTime} - ${item.endTime}
                    </div>
                    <div>
                        <h3>${item.title}</h3>
                        <p>Enjoy your break!</p>
                    </div>
                `;
            }
            scheduleContainer.appendChild(itemElement);
        });
        // If there are no search results, display a message
        if (searchTerm && scheduleContainer.children.length === 0) {
            scheduleContainer.innerHTML = '<p class="no-results">No talks found matching your search criteria.</p>';
        }
    }

    // Initial render
    renderSchedule(eventScheduleData);

    // Search functionality with debounce
    let searchTimeout;
    categorySearchInput.addEventListener('input', (event) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            renderSchedule(eventScheduleData, event.target.value);
        }, 300); // 300ms debounce
    });
});
