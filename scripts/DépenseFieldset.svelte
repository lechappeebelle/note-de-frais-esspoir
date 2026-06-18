<script>
	//@ts-check
    /** @import {Dépense} from "./types" */

    /**
     *
     * @param {Date} d
     * @return {string} - une date au format `yyyy-mm-dd`
     */
    function toISOLocal(d) {
        const yyyy = d.toLocaleDateString("fr-FR", { year: "numeric" });
        const mm = d.toLocaleDateString("fr-FR", { month: "2-digit" });
        const dd = d.toLocaleDateString("fr-FR", { day: "2-digit" });

        return `${yyyy}-${mm}-${dd}`;
    }

    /** @type {{dépense: Dépense, isOpen: boolean, dupliquerCetteDépense: () => void, supprimerCetteDépense: () => void}} */
    let { dépense = $bindable(), isOpen = false, dupliquerCetteDépense, supprimerCetteDépense } = $props();
    let dateSélectionnée = $state(toISOLocal(new Date()));

    const openedText = "Masquer le contenu de cette dépense";
    const closedText = "Afficher le contenu de cette dépense";

    let summaryTitle = $derived(isOpen ? openedText : closedText);

    function getDateDépenseString() {
        return dépense.dateDépense.toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    }

    function changerLaDate() {
        dépense.dateDépense = new Date(dateSélectionnée);
    }

    // ne pas accepter les pdf pour le moment
    // mais à terme, accept = "image/*, .pdf"
    const accept = "image/*"

</script>

<fieldset>
    <details bind:open={isOpen}>
        <summary title={summaryTitle}>
            <div>
                <h3>
                    {getDateDépenseString()} - {dépense.nomFournisseur}
                </h3>
                <div class="actions">
                    <button type="button" onclick={dupliquerCetteDépense}>
                        <svg
                            fill="#372323"
                            width="24px"
                            height="24px"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <title>Dupliquer</title>
                            <path
                                d="M14.513 6a.75.75 0 01.75.75v2h1.987a.75.75 0 010 1.5h-1.987v2a.75.75 0 11-1.5 0v-2H11.75a.75.75 0 010-1.5h2.013v-2a.75.75 0 01.75-.75z"
                            /><path
                                fill-rule="evenodd"
                                d="M7.024 3.75c0-.966.784-1.75 1.75-1.75H20.25c.966 0 1.75.784 1.75 1.75v11.498a1.75 1.75 0 01-1.75 1.75H8.774a1.75 1.75 0 01-1.75-1.75V3.75zm1.75-.25a.25.25 0 00-.25.25v11.498c0 .139.112.25.25.25H20.25a.25.25 0 00.25-.25V3.75a.25.25 0 00-.25-.25H8.774z"
                            /><path
                                d="M1.995 10.749a1.75 1.75 0 011.75-1.751H5.25a.75.75 0 110 1.5H3.745a.25.25 0 00-.25.25L3.5 20.25c0 .138.111.25.25.25h9.5a.25.25 0 00.25-.25v-1.51a.75.75 0 111.5 0v1.51A1.75 1.75 0 0113.25 22h-9.5A1.75 1.75 0 012 20.25l-.005-9.501z"
                            /></svg
                        >
                    </button>
                    <button type="button" onclick={supprimerCetteDépense}>
                        <svg
                            width="24px"
                            height="24px"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <title>Supprimer</title>
                            <path
                                d="M20.5001 6H3.5"
                                stroke="#372323"
                                stroke-width="1.5"
                                stroke-linecap="round"
                            />
                            <path
                                d="M18.8332 8.5L18.3732 15.3991C18.1962 18.054 18.1077 19.3815 17.2427 20.1907C16.3777 21 15.0473 21 12.3865 21H11.6132C8.95235 21 7.62195 21 6.75694 20.1907C5.89194 19.3815 5.80344 18.054 5.62644 15.3991L5.1665 8.5"
                                stroke="#372323"
                                stroke-width="1.5"
                                stroke-linecap="round"
                            />
                            <path
                                d="M9.5 11L10 16"
                                stroke="#372323"
                                stroke-width="1.5"
                                stroke-linecap="round"
                            />
                            <path
                                d="M14.5 11L14 16"
                                stroke="#372323"
                                stroke-width="1.5"
                                stroke-linecap="round"
                            />
                            <path
                                d="M6.5 6C6.55588 6 6.58382 6 6.60915 5.99936C7.43259 5.97849 8.15902 5.45491 8.43922 4.68032C8.44784 4.65649 8.45667 4.62999 8.47434 4.57697L8.57143 4.28571C8.65431 4.03708 8.69575 3.91276 8.75071 3.8072C8.97001 3.38607 9.37574 3.09364 9.84461 3.01877C9.96213 3 10.0932 3 10.3553 3H13.6447C13.9068 3 14.0379 3 14.1554 3.01877C14.6243 3.09364 15.03 3.38607 15.2493 3.8072C15.3043 3.91276 15.3457 4.03708 15.4286 4.28571L15.5257 4.57697C15.5433 4.62992 15.5522 4.65651 15.5608 4.68032C15.841 5.45491 16.5674 5.97849 17.3909 5.99936C17.4162 6 17.4441 6 17.5 6"
                                stroke="#1C274C"
                                stroke-width="1.5"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </summary>
        <label>
            <span>Date</span>
            <input
                id={dateSélectionnée}
                type="date"
                bind:value={dateSélectionnée}
                onchange={changerLaDate}
            />
        </label>
        <label>
            <span>Nom du fournisseur</span>
            <input
                bind:value={dépense.nomFournisseur}
                type="text"
                autocomplete="on"
                name="NomFournisseur"
            />
        </label>
        <label>
            <span>Nature de la dépense</span>
            <input
                bind:value={dépense.natureDépense}
                type="text"
                autocomplete="on"
                name="NatureDépense"
            />
        </label>
        <label>
            <span>Motif de la dépense</span>
            <input
                bind:value={dépense.motifDépense}
                type="text"
                autocomplete="on"
                name="MotifDépense"
            />
        </label>
        <label class="montant">
            <span>Montant TVA de la dépense</span>
            <input
                bind:value={dépense.montantTVA}
                type="number"
                min="0.00"
                step="0.01"
                name="MontantTVA"
            />
        </label>
        <label class="montant">
            <span>Montant TTC de la dépense</span>
            <input
                bind:value={dépense.montantTTC}
                type="number"
                min="0.00"
                step="0.01"
                name="MontantTTC"
            />
        </label>
        <label>
            <span>Commentaires</span>
            <textarea
                bind:value={dépense.commentaires}
                name="commentaires"
            ></textarea>
        </label>
        <label>
            <span>Justificatif</span>
            <span class="hint">
                Uniquement des images. Pour des justificatif en pdf, les fusionner a posteriori avec 
                <a target="_blank" href="https://bento.framapdf.org/fr/merge-pdf.html">un outil dédié</a>
            </span>
            <input
                bind:files={dépense.justificatif}
                accept={accept}
                type="file"
                name="Justificatif"
            />
        </label>

        <div class="actions">
            <button type="button" onclick={dupliquerCetteDépense}>
                <svg
                    fill="#372323"
                    width="24px"
                    height="24px"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    ><path
                        d="M14.513 6a.75.75 0 01.75.75v2h1.987a.75.75 0 010 1.5h-1.987v2a.75.75 0 11-1.5 0v-2H11.75a.75.75 0 010-1.5h2.013v-2a.75.75 0 01.75-.75z"
                    /><path
                        fill-rule="evenodd"
                        d="M7.024 3.75c0-.966.784-1.75 1.75-1.75H20.25c.966 0 1.75.784 1.75 1.75v11.498a1.75 1.75 0 01-1.75 1.75H8.774a1.75 1.75 0 01-1.75-1.75V3.75zm1.75-.25a.25.25 0 00-.25.25v11.498c0 .139.112.25.25.25H20.25a.25.25 0 00.25-.25V3.75a.25.25 0 00-.25-.25H8.774z"
                    /><path
                        d="M1.995 10.749a1.75 1.75 0 011.75-1.751H5.25a.75.75 0 110 1.5H3.745a.25.25 0 00-.25.25L3.5 20.25c0 .138.111.25.25.25h9.5a.25.25 0 00.25-.25v-1.51a.75.75 0 111.5 0v1.51A1.75 1.75 0 0113.25 22h-9.5A1.75 1.75 0 012 20.25l-.005-9.501z"
                    /></svg
                >
                Dupliquer
            </button>
            <button type="button" onclick={supprimerCetteDépense}>
                <svg
                    width="24px"
                    height="24px"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M20.5001 6H3.5"
                        stroke="#372323"
                        stroke-width="1.5"
                        stroke-linecap="round"
                    />
                    <path
                        d="M18.8332 8.5L18.3732 15.3991C18.1962 18.054 18.1077 19.3815 17.2427 20.1907C16.3777 21 15.0473 21 12.3865 21H11.6132C8.95235 21 7.62195 21 6.75694 20.1907C5.89194 19.3815 5.80344 18.054 5.62644 15.3991L5.1665 8.5"
                        stroke="#372323"
                        stroke-width="1.5"
                        stroke-linecap="round"
                    />
                    <path
                        d="M9.5 11L10 16"
                        stroke="#372323"
                        stroke-width="1.5"
                        stroke-linecap="round"
                    />
                    <path
                        d="M14.5 11L14 16"
                        stroke="#372323"
                        stroke-width="1.5"
                        stroke-linecap="round"
                    />
                    <path
                        d="M6.5 6C6.55588 6 6.58382 6 6.60915 5.99936C7.43259 5.97849 8.15902 5.45491 8.43922 4.68032C8.44784 4.65649 8.45667 4.62999 8.47434 4.57697L8.57143 4.28571C8.65431 4.03708 8.69575 3.91276 8.75071 3.8072C8.97001 3.38607 9.37574 3.09364 9.84461 3.01877C9.96213 3 10.0932 3 10.3553 3H13.6447C13.9068 3 14.0379 3 14.1554 3.01877C14.6243 3.09364 15.03 3.38607 15.2493 3.8072C15.3043 3.91276 15.3457 4.03708 15.4286 4.28571L15.5257 4.57697C15.5433 4.62992 15.5522 4.65651 15.5608 4.68032C15.841 5.45491 16.5674 5.97849 17.3909 5.99936C17.4162 6 17.4441 6 17.5 6"
                        stroke="#1C274C"
                        stroke-width="1.5"
                    />
                </svg>
                Supprimer
            </button>
        </div>
    </details>
</fieldset>

<style lang="scss">
    input,
    textarea {
        border: 1px solid #372323;
        border-radius: 1px;
        padding: 0.2rem;
        margin: 0 0.2rem;
        width: 100%;
    }

    label {
        display: flex;
        flex-wrap:wrap;
        flex-direction: column;
        margin-bottom: 0.7rem;

        @media (min-width: 1024px) {
            padding-right: 4rem;
        }

        span {
            font-weight: bold;
        }

        .hint{
            font-size: 0.8em;
            line-height: 1.2em;

            color: #444;  

            a{
                text-decoration: underline;

                color: #333;
            }

            @media (prefers-color-scheme: dark) {
                & {
                    color: #BBB;
                    a{
                        color: #CCC;
                    }
                }
            }
        }

        

        &:last-of-type {
            margin-bottom: 2rem;
        }

        &.montant {
            position: relative;
        }

        &.montant::after {
            content: "€";
            font-size: 18px;
            color: #a99c9c;
            position: absolute;
            bottom: 3px;
            right: 2rem;

            @media (min-width: 1024px) {
                right: 6rem;
            }
        }
    }

    fieldset {
        padding: 1rem;
        border-radius: 1px;
        margin: 0.5rem 0;

        border: 1px solid #372323;

        @media (prefers-color-scheme: dark) {
            & {
                border-color: rgb(255, 249, 215);
            }
        }
        details {
            max-width: 500px;

            &[open] > summary::after {
                transform: rotate(-135deg);
            }

            summary {
                list-style: none;
                padding: 5px 20px 5px 0;
                font-weight: bold;
                font-size: 20px;
                cursor: pointer;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            summary::after {
                content: "";
                border: solid;
                border-width: 0 3px 3px 0;
                display: flex;
                padding: 4px;
                transition: 0.3s;
                transform: rotate(45deg);
                margin-left: 1.3rem;
            }

            summary::-webkit-details-marker {
                display: none;
            }

            summary > div {
                display: flex;
                justify-content: space-between;
                align-items: center;
                flex-wrap: wrap;
                flex-basis: 100%;
            }

            h3 {
                font-size: 1.2rem;
                flex-grow: 1;
            }

            .actions {
                display: flex;
                justify-content: flex-end;
                align-self: flex-start;

                button {
                    color: #372323;
                    border: 1px solid #372323;
                    border-radius: 1px;
                    padding: 0.2rem 1rem;
                    margin: 0 0.5rem;
                    align-self: start;
                }
            }
        }
    }
</style>
