// ==UserScript==
// @name         MangaFreak Bulk Downloader
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Bulk Download by filters on mangafreak.net
// @author       Mr.Error
// @match        *://*.mangafreak.net/Manga/*
// @match        https://w15.mangafreak.net/Manga/*
// @include      *://*mangafreak.net/Manga/*
// @icon         https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://w15.mangafreak.net&size=64
// @updateURL    https://github.com/MrErrorSan/Mangafreak-Bulk-Downloader/raw/main/mangafreakBulkDownloader.user.js
// @downloadURL  https://github.com/MrErrorSan/Mangafreak-Bulk-Downloader/raw/main/mangafreakBulkDownloader.user.js
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const allLinks = Array.from(document.querySelectorAll('a[download]')).map(link => link.href);

    function filterLinks() {
        const fromIndex = parseInt(document.getElementById('fromSelect').value);
        const toIndex = parseInt(document.getElementById('toSelect').value);
        const filteredLinks = allLinks.slice(fromIndex - 1, toIndex);
        displayFilteredLinks(filteredLinks);
    }

    function displayFilteredLinks(filteredLinks) {
        const filteredTable = document.getElementById('filteredTable');
        filteredTable.innerHTML = '';

        filteredLinks.forEach(link => {
            const row = filteredTable.insertRow();
            const cell = row.insertCell(0);
            cell.innerHTML = link;
        });

        const downloadButton = document.getElementById('downloadButton');
        downloadButton.innerHTML = `Download (${filteredLinks.length})`;
        downloadButton.disabled = filteredLinks.length === 0;
    }

    const filterUI = document.createElement('div');
    filterUI.innerHTML = `
        <style>
            select, label,button {
                font-size: 18px;
                padding-top: 5px;
                padding-bottom: 5px;
                padding-left: 15px;
                padding-right: 15px;
                cursor: pointer;
            }
            #downloadButton {
                font-size: 18px;
                padding-top: 7px;
                padding-bottom: 7px;
                padding-left: 15px;
                padding-right: 15px;
                cursor: pointer;
                background-color: #896600;
                color: white;
                border: none;
                border-radius: 5px;
            }
            #filteredTable, #filterButton {
                display: none;
            }
        </style>
        <label for="fromSelect">From:</label>
        <select id="fromSelect">${generateOptions(allLinks)}</select>
        <label for="toSelect">To:</label>
        <select id="toSelect">${generateOptions(allLinks)}</select>
        <button id="filterButton">Filter</button>
        <button id="downloadButton" onclick="downloadLinks()" disabled>Download</button>
        <button onclick="copyToClipboard()">Copy Links</button>
        <table id="filteredTable"></table>
    `;

    const targetNode = document.evaluate('/html/body/div[2]/div[2]/div/div/div/div[3]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    targetNode.appendChild(filterUI);

    document.getElementById('filterButton').addEventListener('click', filterLinks);
    document.getElementById('fromSelect').addEventListener('change', filterLinks);
    document.getElementById('toSelect').addEventListener('change', filterLinks);

    window.downloadLinks = function () {
        const fromIndex = parseInt(document.getElementById('fromSelect').value);
        const toIndex = parseInt(document.getElementById('toSelect').value);
        const filteredLinks = allLinks.slice(fromIndex - 1, toIndex);

        filteredLinks.forEach(link => {
            const tempLink = document.createElement('a');
            tempLink.href = link;
            tempLink.target = '_blank';
            tempLink.style.display = 'none';
            document.body.appendChild(tempLink);

            tempLink.click();

            document.body.removeChild(tempLink);
        });
    }

    window.copyToClipboard = function () {
        const filteredTable = document.getElementById("filteredTable");
        const links = Array.from(filteredTable.getElementsByTagName("td")).map(cell => cell.innerText);
        const textToCopy = links.join('\n');

        navigator.clipboard
            .writeText(textToCopy)
            .then(() => alert("Copied to clipboard"))
            .catch((e) => alert(e.message));
    };


    function generateOptions(links) {
        return links.map((link, index) => `<option value="${index + 1}">${index + 1}</option>`).join('');
    }

    function setToDropdownToLastIndex() {
        document.getElementById('toSelect').value = allLinks.length.toString();
    }

    setToDropdownToLastIndex();
    filterLinks();
})();
