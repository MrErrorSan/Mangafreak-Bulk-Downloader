// ==UserScript==
// @name         MangaFreak Bulk Downloader
// @namespace    http://tampermonkey.net/
// @version      0.6.0
// @description  Bulk Download by filters on mangafreak.net
// @author       Mr.Error
// @match        *://*mangafreak.net/Manga/*
// @include      *://*mangafreak.net/Manga/*
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
            select, label {
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
            #filterButton, #downloadButton {
                display: none;
            }
        </style>
        <label for="fromSelect">From:</label>
        <select id="fromSelect">${generateOptions(allLinks)}</select>
        <label for="toSelect">To:</label>
        <select id="toSelect">${generateOptions(allLinks)}</select>
        <button id="filterButton">Filter</button>
        <button id="downloadButton" onclick="downloadLinks()" disabled>Download</button>
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
            const downloadLink = document.createElement('a');
            downloadLink.href = link;
            downloadLink.download = '';
            downloadLink.click();
        });
    }

    function generateOptions(links) {
        return links.map((link, index) => `<option value="${index + 1}">${index + 1}</option>`).join('');
    }

    function setToDropdownToLastIndex() {
        document.getElementById('toSelect').value = allLinks.length.toString();
    }

    setToDropdownToLastIndex();
    filterLinks();
})();