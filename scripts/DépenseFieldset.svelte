<script>
    import { getContext } from "svelte";

    /** @typedef Dépense
     * @prop {Date} dateDépense - la date de la dépense
     * @prop {string} nomFournisseur - le nom du fournisseur
     * @prop {string} natureDépense - la nature de la dépense
     * @prop {string} motifDépense - le motif de la dépense
     * @prop {number} montantHT - le montant HT
     * @prop {number} montantTTC - le montant TTC
     * @prop {string} commentaires - des commentaires à propos de la dépense
     * @prop {FileList} justificatif - le justificatif de la dépense (plusieurs possibles ?)
     */

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

    /**
     * @type {{dépense: Dépense}, index: number, isOpen: boolean}
     */
    let { dépense, index, isOpen = false } = $props();
    let dateSélectionnée = $state(toISOLocal(new Date()));

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

    const dupliquerUneDépense = getContext("dupliquerUneDépense");

    function dupliquer(e) {
        e.preventDefault();

        dupliquerUneDépense(dépense);
    }
</script>

<fieldset>
    <details bind:open={isOpen}>
        <summary title="Masquer le contenu de cette dépense"
            >{getDateDépenseString()} - {dépense.nomFournisseur}</summary
        >
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
                name="dépense{index + 1}NomFournisseur"
            />
        </label>
        <label>
            <span>Nature de la dépense</span>
            <input
                bind:value={dépense.natureDépense}
                type="text"
                autocomplete="on"
                name="dépense{index + 1}NatureDépense"
            />
        </label>
        <label>
            <span>Motif de la dépense</span>
            <input
                bind:value={dépense.motifDépense}
                type="text"
                autocomplete="on"
                name="dépense{index + 1}MotifDépense"
            />
        </label>
        <label class="montant">
            <span>Montant HT de la dépense</span>
            <input
                bind:value={dépense.montantHT}
                type="number"
                min="0.00"
                step="0.01"
                autocomplete="on"
                name="dépense{index + 1}MontantHT"
            />
        </label>
        <label class="montant">
            <span>Montant TTC de la dépense</span>
            <input
                bind:value={dépense.montantTTC}
                type="number"
                min="0.00"
                step="0.01"
                autocomplete="on"
                name="dépense{index + 1}MontantTTC"
            />
        </label>
        <label>
            <span>Commentaires</span>
            <textarea
                bind:value={dépense.commentaires}
                type="text"
                name="dépense{index + 1}commentaires"
            ></textarea>
        </label>
        <label>
            <span>Justificatif</span>
            <input
                bind:files={dépense.justificatif}
                accept=".jpg, .jpeg, .png, .pdf, .gif"
                type="file"
                name="dépense{index + 1}Justificatif"
            />
        </label>

        <div class="actions">
            <button onclick={dupliquer}>
                <svg
                    fill="#000000"
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
        </div>
    </details>
</fieldset>

<style lang="scss">
    input,
    textarea {
        color: #372323;
        border: 1px solid #372323;
        border-radius: 1px;
        padding: 0.2rem;
        margin: 0 0.2rem;
        width: 100%;
    }

    label {
        display: flex;
        flex-direction: column;
        margin-bottom: 0.7rem;

        @media (min-width: 1024px) {
            padding-right: 4rem;
        }

        span {
            font-weight: bold;
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
        border: 1px solid #372323;
        border-radius: 1px;
        margin: 0.5rem 0;

        @media (prefers-color-scheme: dark) {
            & {
                border: 1px solid rgb(255, 249, 215);
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
                display: inline-block;
                padding: 4px;
                transition: 0.3s;
                transform: rotate(45deg);
            }

            summary::-webkit-details-marker {
                display: none;
            }

            .actions {
                display: flex;
                justify-content: flex-end;

                button {
                    color: #372323;
                    border: 1px solid #372323;
                    border-radius: 1px;
                    padding: 0.2rem 1rem;
                }
            }
        }
    }
</style>
